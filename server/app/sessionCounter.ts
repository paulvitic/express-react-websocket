import {NextFunction, Request, Response} from "express";
import { Logger } from "winston";

export default function sessionCounter(log: Logger) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.session.views) {
            req.session.views++;
        } else {
            req.session.views = 1
        }
        log.info(`req url: ${req.url}, session id: ${JSON.stringify(req.session.id)}, session data: ${JSON.stringify(req.session)}`);
        next();
    }
}
