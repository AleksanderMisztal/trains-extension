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
  wantedPhase: Phase;
}

interface GameArgs {
  name: string;
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
  stack: TicketStack;
  maxPlayers: number;
  phase: Phase;
  players: Player[];
  userEnded: boolean[];

  constructor({ name, stack, maxPlayers, phase, players }: GameArgs) {
    this.name = name;
    this.stack = new TicketStack(
      stack.tickets,
      stack.options,
      stack.gameStarted
    );
    this.maxPlayers = maxPlayers;
    this.phase = phase || Phase.Waiting;
    this.players = players || [];
  }

  getInfo(playerId?: number): ActiveGame | CurrentGame | ArchiveGame {
    const { name, maxPlayers, uid: gameUid, phase, players } = this;
    if (this.phase === Phase.Ended)
      return <ArchiveGame>{
        type: 'archive',
        name,
        maxPlayers,
        gameUid,
        phase,
        players: players.map(({ name, tickets }, id) => ({
          id,
          name,
          tickets,
        })),
      };
    if (this.phase === Phase.Waiting || playerId === undefined)
      return <ActiveGame>{
        type: 'active',
        name,
        maxPlayers,
        gameUid,
        phase,
        players: players.map(({ name, tickets }, id) => ({
          id,
          name,
          ticketCounts: toCounts(tickets),
        })),
      };
    return <CurrentGame>{
      type: 'current',
      name,
      maxPlayers,
      gameUid,
      phase,
      players: players.map(({ name, tickets }, id) => ({
        id,
        name,
        ticketCounts: toCounts(tickets),
      })),
      id: playerId,
      tickets: this.players[playerId].tickets,
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
      wantedPhase: Phase.Waiting,
    };
    this.players.push(player);
    return id;
  }

  setPhase(playerId: number, newPhase: Phase): string | undefined {
    if (newPhase !== next(this.phase))
      return `Cant go from ${this.phase} to ${newPhase}`;

    const player = this.players[playerId];
    if (newPhase === Phase.InProgress && player.tickets.pending.length > 0)
      return 'cant begin with pending tickets';

    if (newPhase === Phase.Ended && player.tickets.pending.length > 0)
      return 'cant end with pending tickets';

    player.wantedPhase = newPhase;
    const allWantNext = this.players.every((p) => p.wantedPhase === newPhase);
    if (!allWantNext) return;

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
    const keep = pending.filter((t: Ticket, i: number) => ticketIds[i]);
    const ret = pending.filter((t: Ticket, i: number) => !ticketIds[i]);
    const keptMinimum = this.stack.returnTickets(ret);
    if (!keptMinimum) return 'keep more tickets';
    owned.push(...keep);
    p.tickets.pending = [];
    this.setPhase(playerId, Phase.InProgress);
  }
}
