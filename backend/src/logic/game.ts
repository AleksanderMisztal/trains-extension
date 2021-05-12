import { TicketStack } from './ticketStack.js';
import {
  Ticket,
  PlayerTickets,
  Phase,
  Uid,
  ActiveGame,
  ArchiveGame,
  CurrentGame,
} from '../types.js';

interface Player {
  userUid: Uid;
  name: string;
  tickets: PlayerTickets;
}

interface GameArgs {
  name: string;
  code: string;
  stack: TicketStack;
  maxPlayers: number;
  phase?: Phase;
  players?: Player[];
}

const next = (phase: Phase): Phase => {
  switch (phase) {
    case Phase.Waiting:
      return Phase.Initial;
    case Phase.Initial:
      return Phase.InProgress;
    case Phase.InProgress:
      return Phase.Ended;
    case Phase.Ended:
      return Phase.Ended;
  }
};

const toCounts = (tickets: PlayerTickets) => ({
  owned: tickets.owned.length,
  pending: tickets.pending.length,
});

export class Game {
  name: string;
  uid: Uid;
  code: string;
  stack: TicketStack;
  maxPlayers: number;
  phase: Phase;
  players: Player[];
  userEnded: boolean[];

  constructor({ name, code, stack, maxPlayers, phase, players }: GameArgs) {
    this.name = name;
    this.code = code;
    this.stack = new TicketStack(
      stack.tickets,
      stack.options,
      stack.gameStarted
    );
    this.maxPlayers = maxPlayers;
    this.phase = phase || Phase.Waiting;
    this.players = players || [];
  }

  getInfo(pId?: number): ActiveGame | CurrentGame | ArchiveGame {
    const { name, code, maxPlayers, uid, phase, players } = this;
    if (this.phase === Phase.Ended)
      return {
        type: 'archive',
        name,
        code,
        maxPlayers,
        uid,
        phase,
        players: players.map(({ name, tickets }, id) => ({
          id,
          name,
          tickets,
        })),
      };
    if (pId === undefined)
      return {
        type: 'active',
        name,
        code,
        maxPlayers,
        uid,
        phase,
        players: players.map(({ name, tickets }, id) => ({
          id,
          name,
          ticketCounts: toCounts(tickets),
        })),
      };
    return {
      type: 'current',
      name,
      code,
      maxPlayers,
      uid,
      phase,
      players: players.map(({ name, tickets }, id) => ({
        id,
        name,
        ticketCounts: toCounts(tickets),
      })),
      id: pId,
      tickets: this.players[pId].tickets,
    };
  }

  addPlayer(name: string, userUid: Uid): number {
    const id = this.players.length;
    const player: Player = {
      name,
      userUid,
      tickets: {
        owned: [],
        pending: [],
      },
    };
    this.players.push(player);
    return id;
  }

  setPhase(playerId: number, newPhase: Phase): string | undefined {
    if (newPhase !== next(this.phase))
      return `Cant go from ${this.phase} to ${newPhase}`;

    const player = this.players[playerId];
    if (
      newPhase === Phase.InProgress &&
      this.players.some((p) => p.tickets.pending.length > 0)
    )
      return 'cant begin with pending tickets';

    if (newPhase === Phase.Ended && player.tickets.pending.length > 0)
      return 'cant end with pending tickets';

    this.phase = newPhase;
    if (newPhase === Phase.Initial)
      this.players.forEach((p) => {
        p.tickets.pending = this.stack.takeInitial();
      });
    if (newPhase === Phase.InProgress) this.stack.beginGame();
  }

  takeTickets(playerId: number): string | undefined {
    const p = this.players[playerId];
    if (p.tickets.pending.length > 0) return 'Return before taking';
    p.tickets.pending = this.stack.takeTickets();
  }

  returnTickets(playerId: number, ticketIds: boolean[]): string | undefined {
    const p = this.players[playerId];
    const { owned, pending } = p.tickets;
    if (!pending) return 'player has no pending tickets';
    if (pending.length !== ticketIds.length) return 'wrong number of tickets';
    const keep = pending.filter((_: Ticket, i: number) => ticketIds[i]);
    const ret = pending.filter((_: Ticket, i: number) => !ticketIds[i]);
    const keptMinimum = this.stack.returnTickets(ret);
    if (!keptMinimum) return 'keep more tickets';
    owned.push(...keep);
    p.tickets.pending = [];
    this.setPhase(playerId, Phase.InProgress);
  }
}
