import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class ApiSocket {
    private static s_Instance?: ApiSocket;
    public static s_GetInstance(): ApiSocket {
        if (!ApiSocket.s_Instance) {
            ApiSocket.s_Instance = new ApiSocket();
        }
        return ApiSocket.s_Instance;
    }

    private _socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    private _isApiMode: boolean;
    protected constructor() {
        this._socket = io("ws://localhost:3000");
        this._isApiMode = false;
    }
    public get socket(): Socket<DefaultEventsMap, DefaultEventsMap> { return this._socket; }
    public DoAction(func: (...args: any[]) => void): void {
        if (this._isApiMode) {
            func();
        } else {
            this._socket.on("onApiMode", () => {
                this._isApiMode = true;
                func();
            });
            this._socket.emit("setApiMode");
        }
    }
}