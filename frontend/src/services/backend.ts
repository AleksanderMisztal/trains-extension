import http from './http';
import {
  ArchiveGame,
  CreateGameRequest,
  CurrentGame,
  Phase,
  TicketSet,
  User,
} from '../types';

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

const getSets = async (): Promise<{ [name: string]: TicketSet }> => {
  const response = await http.get('/api/games/sets', {}, token);
  const decks: { [name: string]: TicketSet } = response.data;
  return decks;
};

const getArchives = async (): Promise<ArchiveGame[]> => {
  const response = await http.get('/api/games/archive', {}, token);
  const games: ArchiveGame[] = response.data;
  return games;
};

const createGame = async (name: string, deck: string): Promise<CurrentGame> => {
  const stackOptions = {
    initialTake: {
      take: 7,
      keep: 3,
      types: {
        long: 2,
        short: 5,
      },
    },
    stdTake: {
      take: 3,
      keep: 2,
    },
  };
  const body: CreateGameRequest = { name, setName: deck, stackOptions };
  const response = await http.post('/api/games', body, token);
  const game: CurrentGame = response.data;
  return game;
};

const joinGame = async (code: string): Promise<CurrentGame> => {
  const response = await http.post('/api/games/join', { code }, token);
  const game: CurrentGame = response.data;
  return game;
};

const getCurrentGame = async (): Promise<CurrentGame> => {
  const response = await http.get('/api/games/current', {}, token);
  const game: CurrentGame = response.data;
  return game;
};

const beginGame = async (): Promise<CurrentGame> => {
  const response = await http.post(
    '/api/games/phase',
    { phase: Phase.Initial },
    token
  );
  const game: CurrentGame = response.data;
  return game;
};

const endGame = async (): Promise<ArchiveGame> => {
  const response = await http.post(
    '/api/games/phase',
    { phase: Phase.Ended },
    token
  );
  const game: ArchiveGame = response.data;
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
  getSets,
  getArchives,
  createGame,
  joinGame,
  getCurrentGame,
  beginGame,
  endGame,
  takeTickets,
  returnTickets,
};
