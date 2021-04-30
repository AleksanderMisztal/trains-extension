import jwt from 'jsonwebtoken';
import config from 'config';
import { RequestHandler, Request } from 'express';
import { Collection, getCollection } from '../db.js';
import { User } from '../types.js';
import { Game } from '../logic/game.js';

const jwtPrivateKey: string = config.get('jwtPrivateKey');
const usersDb: Collection<User> = getCollection<User>('users');
const gamesDb: Collection<Game> = getCollection<Game>(
  'games',
  (gd: Game) => new Game(gd)
);

export const auth: RequestHandler = (req: Request, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const { userUid } = jwt.verify(token, jwtPrivateKey) as { userUid: string };

    const user = usersDb.get(userUid);
    if (!user) return res.status(400).send('This user has been deleted.');

    req.user = user;
    console.log('user set!', { user });
    if (!user.game) return next();

    const game = gamesDb.get(user.game.uid);
    req.game = game;
    next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
};
