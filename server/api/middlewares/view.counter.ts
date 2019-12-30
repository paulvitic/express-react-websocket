import { Request, Response, NextFunction } from 'express';
import log from '../../common/logger';

export default function viewCounter(req: Request, res: Response, next: NextFunction) {
  if (req.session.views) {
    req.session.views++;
    log.info(`req session views: ${req.session.views}`);
    log.info(`cookie expires in: ${req.session.cookie.maxAge / 1000}`);
  } else {
    req.session.views = 1
  }
  next();
}

