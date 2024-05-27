const { createServer } = require("http");
const next = require("next");
const { WebSocketServer } = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});

let nNextRoomId = 0;
const pRooms = new Object();

function joinRoom(socket, roomId) {
    if (!socket.id) return;
    if (pRooms[roomId] == null) {
        pRooms[roomId] = new Array();
    }
    pRooms[roomId].push(socket.id);
}
function leaveRoom(socket) {
    if (!socket.id) return;
    Object.keys(pRooms).forEach(roomId => {
        const idx = pRooms[roomId].indexOf(socket.id);
        if (idx != -1) {
            pRooms[roomId] = pRooms[roomId].filter(ipaddr => ipaddr != socket.id);
        }
    });
}

const wss = new WebSocketServer({ port: 3001 });
wss.on("connection", (socket, req) => {
    socket.id = `${(new Date().getTime())}/${Math.floor(Math.random() * 10)}`;
    console.log("WS Connection!", socket.id);

    socket.on("error", console.error);
    socket.on("close", () => {
        leaveRoom(socket);
        console.log("WS Closed!", socket.id);
    });
    socket.on("message", rawData => {
        const data = JSON.parse(rawData.toString());
        if (data.isApi) {
            switch (data.type) {
                case "makeRoom":
                    const roomId = (nNextRoomId++).toString();
                    joinRoom(socket, roomId);
                    socket.send({
                        type: "newRoom", roomId
                    });
                    console.log("rooms :", Object.keys(pRooms));
                    return;
                case "clearRooms":
                    pRooms = new Object();
                    console.log("rooms :", Object.keys(pRooms));
                    return;
                case "sendNumber":
                    if (data.roomId && typeof data.data == "number") {
                        if (pRooms[data.roomId] == null) {
                            joinRoom(socket, data.roomId);
                        }
                        console.log("sendNumber", data.data, "to", data.roomId);
                        console.log("socket ids :", pRooms[data.roomId]);
                        wss.clients.forEach(ws => {
                            if (ws.id != socket.id && pRooms[data.roomId].indexOf(ws.id) != -1) {
                                console.log("num", data.data, "to", ws.id);
                                ws.send(JSON.stringify({
                                    type: "numData",
                                    data: data.data,
                                }));
                            }
                        });
                    }
                    return;
            }
        }
        console.log(socket.id, data);
        switch (data.type) {
            case "getAllRooms":
                socket.send(JSON.stringify({
                    type: "allRooms",
                    data: Object.keys(pRooms),
                }));
                return;
            case "moveToRoom":
                if (data.roomId && pRooms[data.roomId] != null) {
                    leaveRoom(socket);
                    joinRoom(socket, data.roomId);
                    console.log("moveToRoom", socket.id, data.roomId);
                    console.log(pRooms);
                }
                return;
            case "leaveRooms":
                leaveRoom(socket);
                return;
        }
    });
});