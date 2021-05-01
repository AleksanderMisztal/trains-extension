import http from './http';
import {
  ActiveGame,
  CurrentGame,
  GameBase,
  Phase,
  Uid,
  User,
} from '../types.js';

let token = localStorage.getItem('userToken') || '';

const createUser = async (name: string): Promise<{ name: string }> => {
  const response = await http.post('/api/users', { name });
  token = response.headers['x-auth-token'];
  localStorage.setItem('userToken', token);
  return { name };
};

const getUser = async (): Promise<User> => {
  const response = await http.get('/api/users/me', {}, token);
  const user: User = response.data;
  return user;
};

const getGames = async (): Promise<GameBase[]> => {
  const response = await http.get('/api/games', {}, token);
  const games: GameBase[] = response.data;
  return games;
};

const createGame = async (name: string): Promise<ActiveGame> => {
  const response = await http.post('/api/games', { name });
  const game: ActiveGame = response.data;
  return game;
};

const joinGame = async (gameUid: Uid): Promise<CurrentGame> => {
  const response = await http.post('/api/games/join', { gameUid }, token);
  const game: CurrentGame = response.data;
  return game;
};

const getCurrentGame = async (): Promise<CurrentGame> => {
  const response = await http.get('/api/games/current', {}, token);
  const game: CurrentGame = response.data;
  return game;
};

const setPhase = async (phase: Phase): Promise<CurrentGame> => {
  const response = await http.post('/api/games/phase', { phase }, token);
  const game: CurrentGame = response.data;
  return game;
};

const takeTickets = async (): Promise<CurrentGame> => {
  const response = await http.post('/api/games/take', {}, token);
  const game: CurrentGame = response.data;
  return game;
};

const returnTickets = async (toKeep: boolean[]): Promise<CurrentGame> => {
  const response = await http.post(
    '/api/games/return',
    { ticketIds: toKeep },
    token
  );
  const game: CurrentGame = response.data;
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
