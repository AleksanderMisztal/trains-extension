export interface ObjectWithUid {
  uid: string;
}

export interface User {
  name: string;
  archive: { uid: string; playerId: number }[];
  game?: { uid: string; playerId: number };
}

export enum Phase {
  Waiting = 'waiting',
  Initial = 'initial',
  InProgress = 'in progress',
  Ended = 'ended',
}

export interface Ticket {
  city1: string;
  city2: string;
  points: number;
}

export interface PlayerTickets {
  owned: Ticket[];
  pending: Ticket[];
}

export interface StackOptions {
  inittake: { [name: string]: number };
  initkeep: number;
  stdtake: number;
  stdkeep: number;
}

export type TicketSet = {
  [idx: string]: Ticket[];
};

export interface ActivePlayer {
  id: number;
  name: string;
  ticketCounts: { owned: number; pending: number };
}

export interface ArchivePlayer {
  id: number;
  name: string;
  tickets: PlayerTickets;
}

export interface GameBase {
  type: 'active' | 'current' | 'archive';
  name: string;
  uid: string;
  code: string;
  phase: Phase;
  maxPlayers: number;
}

export interface ActiveGame extends GameBase {
  players: ActivePlayer[];
}

export interface CurrentGame extends ActiveGame {
  id: number;
  tickets: PlayerTickets;
}

export interface ArchiveGame extends GameBase {
  players: ArchivePlayer[];
}

export type CreateGameRequest = {
  name: string;
  setName: string;
  stackOptions: StackOptions;
};
