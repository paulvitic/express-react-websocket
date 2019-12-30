import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import session from 'express-session';
import log from './logger';
import installValidator from './swagger';
import viewCounter from "../api/middlewares/view.counter";
import sessionConfig from "./sessionConfig";
import WebSocketServer from "./webSocketServer";

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
      const server = http.createServer(app);
      new WebSocketServer(server);
      server.listen(port, welcome(port));

    }).catch(e => {
      log.error(`Error while calling Server listen : ${e}`);
      exit(1)
    });

    return app;
  }
}
