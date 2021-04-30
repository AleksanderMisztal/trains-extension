import React from 'react';
import { CurrentGame as TCurrentGame, Phase } from '../../types';
import { PendingTickets } from './PendingTickets';
import { GameState } from './GameState';
import { Tickets } from './Tickets';

export const CurrentGame = ({ game }: { game: TCurrentGame }) => {
  const waiting = game.phase === Phase.Waiting;

  return (
    <>
      <GameState current={game} />
      {!waiting && (
        <>
          <PendingTickets tickets={game.tickets.pending} />
          <Tickets title="Owned tickets" tickets={game.tickets.owned} />
        </>
      )}
    </>
  );
};
