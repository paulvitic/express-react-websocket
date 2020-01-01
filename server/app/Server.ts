import express, {Application, NextFunction, Request, Response} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import os from 'os';
import installValidator from './swagger';
import sessionConfig from "./sessionConfig";
import WebSocketServer from "./WebSocketServer";
import LogFactory from "./LogFactory";
import {Store} from "express-session";
import routes from "../routes";

const app = express();
const exit = process.exit;

export default class ExpressServer {
  private readonly log = LogFactory.get(ExpressServer.name);

  constructor(private readonly port: number, sessionStore: Store) {
    app.set('sessionStore', sessionStore);
    app.use(cors());
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb'}));
    app.use(cookieParser());
    sessionConfig(app);
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.session.views) {
          this.log.info(`req url: ${req.url}, session views: ${req.session.views}`);
          req.session.views++;
        } else {
          req.session.views = 1
        }
        next()
    });
    app.use(express.static(`${path.normalize(__dirname + '/../..')}/dist/static`));
  }

  listen = (): ExpressServer => {
    const welcome = () => () => {
      this.log.info(
          `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${this.port}}`
      );
    };

    installValidator(app).then(() => {
      routes(app);
      const server = http.createServer(app);
      new WebSocketServer(server);
      server.listen(this.port, welcome());
    }).catch(e => {
      this.log.error(`Error while calling Server listen : ${e}`);
      exit(1)
    });

    return this;
  }
}
