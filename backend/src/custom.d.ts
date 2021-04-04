import { ObjectWithUid, User } from './types';
import { Game } from './logic/game';

declare namespace Express {
  export interface Request {
    user: User;
    game?: Game;
  }
}
declare module 'express-serve-static-core' {
  interface Request {
    user: User & ObjectWithUid;
    game?: Game;
  }
}
