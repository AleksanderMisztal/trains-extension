import assert from 'assert';
import Game from '../logic/game.js';
import TicketStack from '../logic/ticketStack.js';
import { saveObject } from '../utils.js';

describe('Game', () => {
  it('should add a player', () => {
    const game = new Game([]);
    game.addPlayer('Alek');
    const alek = game.getPlayer(0);

    assert.strictEqual(alek.id, 0);
    assert.strictEqual(alek.name, 'Alek');
    assert.notStrictEqual(alek.tickets, []);
    assert.notStrictEqual(alek.pendingTickets, []);
  });
  it('should take and return tickets', () => {
    const stack = new TicketStack(['a', 'b', 'c']);
    const game = new Game(stack);
    game.addPlayer('Alek');
    const tickets = game.takeTickets(0);
    assert.strictEqual(tickets.length, 3);
    game.returnTickets(0, [1, 2]);

    const alek = game.getPlayer(0);

    assert.notStrictEqual(alek.pendingTickets, []);
    assert.strictEqual(alek.tickets.length, 1);
  });
});

describe('saveObject', () => {
  it('should create', () => {
    saveObject('test.json', ['1, 2', 3]);
  });
});
