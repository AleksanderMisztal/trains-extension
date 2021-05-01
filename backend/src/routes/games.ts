import { Router } from 'express';
import { Game } from '../logic/game.js';
import { TicketStack } from '../logic/ticketStack.js';
import { getCollection, Collection } from '../db.js';
import { loadObject } from '../utils.js';
import { auth } from '../middleware/auth.js';
import { Ticket, User, Phase } from '../types.js';

const usersDb: Collection<User> = getCollection<User>('users');
const gamesDb: Collection<Game> = getCollection<Game>(
  'games',
  (gd: Game) => new Game(gd)
);
const getShortTickets = () => {
  const ts = loadObject<Ticket[]>('./db/short-tickets.json');
  ts.length = 40;
  return ts;
};
const getLongTickets = () => loadObject<Ticket[]>('./db/long-tickets.json');

const router = Router();

// get games
router.get('/', auth, (req, res) => {
  const { user } = req;
  if (!user || !user.game) {
    const gamesInfo = gamesDb.data.map((g: Game) => g.getInfo());
    res.send(gamesInfo);
  } else {
    const { uid, playerId } = user.game;
    const gamesInfo = gamesDb.data.map((g: Game) =>
      uid === g.uid ? g.getInfo(playerId) : g.getInfo()
    );
    res.send(gamesInfo);
  }
});

// create a game
router.post('/', (req, res) => {
  const { name } = req.body;
  const stack = new TicketStack({
    long: getLongTickets(),
    short: getShortTickets(),
  });
  const game = new Game({ name, stack, maxPlayers: 6 });
  gamesDb.add(game);
  res.status(201).send(game.getInfo());
});

// all below return game.getInfo(playerId)
// join a game
router.post('/join', auth, (req, res) => {
  const { gameUid } = req.body;
  const { user } = req;
  const game = gamesDb.get(gameUid);
  if (user.game)
    return res.status(400).send("Can't join more than one game at a time!");
  if (game.phase !== Phase.Waiting)
    return res.status(400).send('Cant join this game, not in waiting phase');
  if (game.players.length === game.maxPlayers)
    return res.status(400).send('This game is full!');
  const playerId = game.addPlayer(user.name, user.uid);
  user.game = { uid: game.uid, playerId };
  res.send(game.getInfo(playerId));
});

// get current game
router.get('/current', auth, (req, res) => {
  const { user } = req;
  if (!user.game) return res.status(400).send('User not in game.');

  const { uid: gameUid, playerId } = user.game;
  const game = gamesDb.get(gameUid);
  res.send(game.getInfo(playerId));
});

// set a phase
router.post('/phase', auth, (req, res) => {
  const { phase } = req.body;
  const { user } = req;
  if (!user.game) return res.status(400).send('user not in game');

  const { uid: gameUid, playerId } = user.game;
  const game = gamesDb.get(gameUid);

  const error = game.setPhase(playerId, phase);
  if (error) return res.status(400).send(error);

  if (game.phase === Phase.Ended) {
    game.players.forEach((p) => {
      const u = usersDb.get(p.userUid);
      u.archive.push(u.game);
      u.game = undefined;
    });
  }

  res.send(game.getInfo(playerId));
});

// take tickets
router.post('/take', auth, (req, res) => {
  const { user } = req;
  if (!user.game) return res.status(400).send('user not in game');

  const { uid: gameUid, playerId } = user.game;
  const game = gamesDb.get(gameUid);
  if (game.phase !== Phase.InProgress)
    return res.status(400).send('game not in progess');

  game.takeTickets(playerId);
  res.send(game.getInfo(playerId));
});

// return tickets
router.post('/return', auth, (req, res) => {
  const { ticketIds } = req.body;
  const { user, game } = req;
  if (!game) return res.status(400).send('user not in game');

  const { playerId } = user.game;

  const error = game.returnTickets(playerId, ticketIds);
  if (error) return res.status(400).send(error);

  res.send(game.getInfo(playerId));
});

export default router;
