import {Response, Request, NextFunction} from 'express';
import * as _debug from 'debug';

const debug = _debug('config:custom');

/**
 * Sets some expected behaviours from the app.
 * @param req The request.
 * @param res The response.
 * @param next Next function to execute.
 */
export function customConfig(req: Request,
                             res: Response,
                             next: NextFunction) {
  // Custom header
  res.set('Content-Type', 'application/json');
  next();
}
