import * as WebSocket from "ws";
import LogFactory from "./LogFactory";
import {Server as HttpServer} from "http";
import { Server } from "ws";

export default class WebSocketServer {
    private readonly log = LogFactory.get(WebSocketServer.name);
    private readonly wss: Server;
    private readonly broadcastRegex = /^broadcast:/;

    constructor(server: HttpServer) {
        this.wss = new WebSocket.Server({ server });
    }

    init = (): Promise<WebSocketServer> => {
        return new Promise<WebSocketServer>((resolve, reject) => {
            this.wss.on('connection', (ws: WebSocket) => {
                ws.on('message', (message: string) => this.onMessage(ws, message));
                ws.send('Hi there, I am a WebSocket server');
            });
            resolve(this);
        })
    };

    private onMessage = (ws: WebSocket, message: string) => {
        this.log.info(`received: ${message}`);
        if (this.shouldBroadCast(message)) {
            this.broadCast(ws, message);
        } else {
            this.log.info(`received: ${message}`);
            ws.send(`Hello, you sent -> ${message}`);
        }
    };

    private shouldBroadCast = (message: string): boolean=> {
        return this.broadcastRegex.test(message)
    };

    private broadCast = (sender: WebSocket, message: string) => {
        this.wss.clients
            .forEach(client => {
                if (client != sender) {
                    client.send(`Hello, broadcast message -> ${message}`);
                }
            });
    }

    // TODO add heartbeat, see: https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
}


