import http from './http';
import { store } from '../contexts/gameContext';
import {
  ActiveGame,
  CurrentGame,
  GameBase,
  Phase,
  Uid,
  User,
} from '../types.js';

let token = localStorage.getItem('userToken') || '';

const createUser = async (name: string): Promise<string> => {
  const response = await http.post('/api/users', { name });
  token = response.headers['x-auth-token'];
  store.dispatch({ type: 'setuser', user: { name } });
  localStorage.setItem('userToken', token);
  return token;
};

const getUser = async (): Promise<User> => {
  const response = await http.get('/api/users/me', {}, token);
  const user: User = response.data;
  store.dispatch({ type: 'setuser', user });
  return user;
};

const getGames = async (): Promise<GameBase[]> => {
  console.log({ token });
  const response = await http.get('/api/games', {}, token);
  const games: GameBase[] = response.data;
  store.dispatch({ type: 'setgames', games });
  return games;
};

const createGame = async (name: string): Promise<ActiveGame> => {
  const response = await http.post('/api/games', { name });
  const game: ActiveGame = response.data;
  store.dispatch({ type: 'addgame', game });
  return game;
};

const joinGame = async (gameUid: Uid): Promise<CurrentGame> => {
  const response = await http.post('/api/games/join', { gameUid }, token);
  const game: CurrentGame = response.data;
  store.dispatch({ type: 'modifygame', game });
  return game;
};

const getCurrentGame = async (): Promise<CurrentGame> => {
  const response = await http.get('/api/games/current', {}, token);
  const game: CurrentGame = response.data;
  store.dispatch({ type: 'modifygame', game });
  return game;
};

const setPhase = async (phase: Phase): Promise<CurrentGame> => {
  const response = await http.post('/api/games/phase', { phase }, token);
  const game: CurrentGame = response.data;
  store.dispatch({ type: 'modifygame', game });
  return game;
};

const takeTickets = async (): Promise<CurrentGame> => {
  const response = await http.post('/api/games/take', {}, token);
  const game: CurrentGame = response.data;
  store.dispatch({ type: 'modifygame', game });
  return game;
};

const returnTickets = async (toKeep: boolean[]): Promise<CurrentGame> => {
  const response = await http.post(
    '/api/games/return',
    { ticketIds: toKeep },
    token
  );
  const game: CurrentGame = response.data;
  store.dispatch({ type: 'modifygame', game });
  return game;
};

export const backend = {
  createUser,
  getUser,
  getGames,
  createGame,
  joinGame,
  getCurrentGame,
  setPhase,
  takeTickets,
  returnTickets,
};
