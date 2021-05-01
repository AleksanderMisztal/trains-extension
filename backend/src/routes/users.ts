import { Router, Request } from 'express';
import { getCollection, Collection } from '../db.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import { auth } from '../middleware/auth.js';
import { User } from '../types.js';

const usersDb: Collection<User> = getCollection('users');
const router = Router();
const jwtPrivateKey = '8bfb013kwi7dbrygkjckwbefy92378yr8gf782gr4289';

// create a user
router.post('/', (req, res) => {
  const { name } = req.body;
  const userUid = usersDb.add({ name, archive: [] });
  const token = jwt.sign({ userUid }, jwtPrivateKey);
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send('ok');
});

// get user data
router.get('/me', auth, (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send('This user has been deleted');
  return res.send(user);
});

export default router;
