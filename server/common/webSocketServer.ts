import * as WebSocket from "ws";
import log from "./logger";
import {Server as HttpServer} from "http";
import {Server} from "ws";


export default class WebSocketServer {
    private readonly wss: Server;

    constructor(server: HttpServer) {
        this.wss = new WebSocket.Server({ server });
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws: WebSocket) => {

            //connection is up, let's add a simple simple event
            ws.on('message', (message: string) => {

                //log the received message and send it back to the client
                log.info(`received: ${message}`);

                const broadcastRegex = /^broadcast\:/;

                if (broadcastRegex.test(message)) {
                    message = message.replace(broadcastRegex, '');

                    //send back the message to the other clients
                    this.wss.clients
                        .forEach(client => {
                            if (client != ws) {
                                client.send(`Hello, broadcast message -> ${message}`);
                            }
                        });

                } else {
                    log.info(`received: ${message}`);
                    ws.send(`Hello, you sent -> ${message}`);
                }
            });

            //send immediately a feedback to the incoming connection
            ws.send('Hi there, I am a WebSocket server');
        });
    }

    // TODO add heartbeat, see: https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
}


