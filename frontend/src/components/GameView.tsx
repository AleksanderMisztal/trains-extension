import React from 'react';
import { CurrentGame, Phase } from '../types';
import { PendingTickets } from './PendingTickets';
import { GameState } from './GameState';
import { Tickets } from './Tickets';

export const GameView = ({ current }: { current: CurrentGame }) => {
  const waiting = current.phase === Phase.Waiting;

  return (
    <>
      <GameState current={current} />
      {!waiting && (
        <>
          <PendingTickets tickets={current.tickets.pending} />
          <Tickets title="Owned tickets" tickets={current.tickets.owned} />
        </>
      )}
    </>
  );
};
