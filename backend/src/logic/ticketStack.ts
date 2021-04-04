import { shuffle } from '../utils.js';
import { Ticket, TicketSet, StackOptions } from '../types.js';

const defaultStackOptions: StackOptions = {
  initialTake: {
    take: 6,
    keep: 2,
    types: {
      long: 2,
      short: 4,
    },
  },
  stdTake: {
    take: 3,
    keep: 1,
  },
};

export class TicketStack {
  tickets: TicketSet;
  options: StackOptions;
  gameStarted: boolean;

  constructor(
    tickets: TicketSet,
    options?: StackOptions,
    gameStarted?: boolean
  ) {
    this.tickets = tickets;
    this.options = options || defaultStackOptions;
    this.gameStarted = gameStarted || false;
    if (!tickets.stack) tickets.stack = [];
    if (!tickets.returned) tickets.returned = [];
    Object.values(tickets).forEach((set) => shuffle(set));
  }

  // gives initial tickets
  takeInitial(): Ticket[] {
    const take = [];
    const typeCountPairs = Object.entries(this.options.initialTake.types);
    for (const [type, count] of typeCountPairs) {
      take.push(...this.tickets[type].splice(-count, count));
    }
    return take;
  }

  beginGame(): void {
    if (this.gameStarted) return;
    for (const [type, tickets] of Object.entries(this.tickets)) {
      if (type === 'stack' || type === 'returned') continue;
      this.tickets.stack.push(...tickets);
      delete this.tickets[type];
    }
    shuffle(this.tickets.stack);
    this.gameStarted = true;
  }

  // pop options.stdTake.take tickets from the top of the stack
  takeTickets(): Ticket[] {
    const { take } = this.options.stdTake;
    if (this.tickets.stack.length < take) {
      this.tickets.stack = [
        ...shuffle(this.tickets.returned),
        ...this.tickets.stack,
      ];
      this.tickets.returned = [];
    }
    const taken = this.tickets.stack.splice(-take, take);
    return taken;
  }

  // returns true on success, false otherwise
  returnTickets(tickets: Ticket[]): boolean {
    const { take, keep } = this.gameStarted
      ? this.options.stdTake
      : this.options.initialTake;
    if (tickets.length > take - keep) return false;
    this.tickets.returned.push(...tickets);
    return true;
  }
}
