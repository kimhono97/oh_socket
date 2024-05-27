
export default class ApiSocket {
    private static s_Instance?: ApiSocket;
    public static s_GetInstance(): ApiSocket {
        if (!ApiSocket.s_Instance) {
            ApiSocket.s_Instance = new ApiSocket();
        }
        return ApiSocket.s_Instance;
    }

    private _socket: WebSocket;
    protected constructor() {
        this._socket = new WebSocket("ws://localhost:3000");
    }
    public get socket(): WebSocket { return this._socket; }
    public Send(type: string, obj: {[key:string]:any}): void {
        obj.type = type;
        obj.isApi = true;
        this._socket.send(JSON.stringify(obj));
    }
    public OnMessage(func: Function): void {
        this._socket.addEventListener("message", msg => {
            func(JSON.parse(msg.toString()));
        });
    }
    public OnOpen(func: Function): void {
        this._socket.addEventListener("open", ev => {
            func(ev);
        });
    }
}