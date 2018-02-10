import {Request, Response} from 'express';
import {Route} from '.';

export const api: Route = {
  route: '/',
  callback: apiCb,
  method: 'GET'
};

function apiCb(_: Request, res: Response): void {
  res.send({message: 'Api works for you'});
}
