const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let nNextRoomId = 0;

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    function getAllRooms() {;
        const { sids, rooms } = io.sockets.adapter;
        const publicRooms = new Array();
        rooms.forEach((_, roomId) => {
            if (!sids.get(roomId)) {
                publicRooms.push(roomId);
            }
        });
        return publicRooms;
    }
    function clearRooms() {
        const { sids, rooms } = io.sockets.adapter;
        rooms.forEach((_, key) => {
            if (!sids.get(key)) {
                io.sockets.socketsLeave(key);
                io.sockets.emit("roomClosed", key);
            }
        });
    }

    io.on("connection", (socket) => {
        socket.on("setApiMode", () => {
            socket.on("makeRoom", () => {
                const roomId = (nNextRoomId++).toString();
                socket.join(roomId);
                socket.emit("newRoom", roomId);
                console.log("rooms :", getAllRooms());
            });
            socket.on("clearRooms", () => {
                clearRooms();
                console.log("rooms :", getAllRooms());
            });
            socket.on("sendNumber", (roomId, data) => {
                if (io.sockets.adapter.rooms.has(roomId)) {
                    console.log("sendNumber", { roomId, data });
                    io.to(roomId).emit("numData", data);
                }
            });
            socket.emit("onApiMode");
        });
        socket.on("getAllRooms", () => {
            const rooms = getAllRooms();
            socket.emit("allRooms", JSON.stringify(rooms));
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});