import {api} from './api';
import {leafIdentifier} from './leafIdentifier';
import {Request, Response} from 'express';

/**
 * Defines how the routes will be structured: with a route(path/uri), a
 * method, and the callback that will be performed once the route is requested.
 */
export interface Route {
  route: string;
  method: 'POST' | 'GET';
  callback: (req: Request, res: Response) => void;
}

export const routes: Route[] = [
  api,
  leafIdentifier
];

/**
 * Defines a standard about how to handle errors. It only receives a message
 * and send a response informing what went wrong.
 * @param res The response.
 * @param error Information about the error occurred.
 * @param status Information about status of the request.
 */
export function errorHandler(res: Response,
                             error: string | any,
                             status = 400) {
  res.status(status);
  if (typeof error === 'string') {
    res.send({error: error});
  } else {
    res.send(error);
  }
}
