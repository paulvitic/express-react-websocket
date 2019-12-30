import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import * as WebSocket from 'ws';
import os from 'os';
import session from 'express-session';
import log from './logger';


import installValidator from './swagger';
import viewCounter from "../api/middlewares/view.counter";
import sessionConfig from "./sessionConfig";

const app = express();
const exit = process.exit;

export default class ExpressServer {
  private routes: (app: Application) => void;

  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb'}));
    // see: https://expressjs.com/en/resources/middleware/session.html
    app.use(session(sessionConfig(app)));
    app.use(viewCounter);
    app.use(express.static(`${root}/dist/static`));
  }

  router(routes: (app: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => () => {
      log.info(
          `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${p}}`
      );
    };

    installValidator(app, this.routes).then(() => {
      // http.createServer(app).listen(port, welcome(port));

      ////////////////////////////////////////
      // add web socket listener /////////////
      const server = http.createServer(app);

      const wss = new WebSocket.Server({ server });
      wss.on('connection', (ws: WebSocket) => {

        //connection is up, let's add a simple simple event
        ws.on('message', (message: string) => {

          //log the received message and send it back to the client
          log.info(`received: ${message}`);

          const broadcastRegex = /^broadcast\:/;

          if (broadcastRegex.test(message)) {
            message = message.replace(broadcastRegex, '');

            //send back the message to the other clients
            wss.clients
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

      server.listen(port, welcome(port));
      // TODO add heartbeat, see: https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
      ////////////////////////////////////

    }).catch(e => {
      log.error(`Error while calling Server listen : ${e}`);
      exit(1)
    });

    return app;
  }
}
