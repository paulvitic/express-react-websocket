import express, {Application, NextFunction, Request, Response} from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import http, {Server} from 'http';
import cors from 'cors';
import os from 'os';
import installApiDocs from './swagger';
import cookieParser from 'cookie-parser';

import sessionConfig from "./sessionConfig";
import WebSocketServer from "./WebSocketServer";
import LogFactory from "./LogFactory";
import session, {Store} from "express-session";
import routes from "./routes";
import errorHandler from "./errorHandler";
import sessionCounter from "./sessionCounter";

const app = express();
const exit = process.exit;

function addWebsocket(): Server {
  const server = http.createServer(app);
  new WebSocketServer(server);
  return server;
}

export default class ExpressServer {
  private readonly log = LogFactory.get(ExpressServer.name);

  constructor(private readonly port: number, sessionStore: Store) {
    app.set('sessionStore', sessionStore);
    app.enable('case sensitive routing');
    app.enable('strict routing');

    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb'}));

    app.use(cors());
    app.use(cookieParser());
    app.use(session(sessionConfig(app)));
    app.use(sessionCounter(this.log));

    app.use(express.static(`${path.normalize(__dirname + '/../..')}/dist/static`));

    app.use(errorHandler);

    routes(app);
  }

  listen = (): ExpressServer => {
    // log middleware
    require('express-list-middleware')(app).forEach((m)=> {
      this.log.info(m);
    });

    installApiDocs(app).then(() => {
      addWebsocket().listen(this.port, () => {
        this.log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${this.port}}`)
      });
    }).catch(e => {
      this.log.error(`Error while calling Server listen : ${e}`);
      exit(1)
    });

    return this;
  }
}
