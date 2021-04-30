import React from 'react';
import { Tickets } from './Tickets';
import { ArchiveGame, GameBase, PlayerTickets } from '../../types';

export const FinalState = ({ game }: { game: GameBase }) => {
  return (
    <>
      {(game as ArchiveGame).players.map(
        (p: { tickets: PlayerTickets; name: string }, i: number) => (
          <Tickets
            key={i}
            title={p.name + "'s tickets"}
            tickets={p.tickets.owned}
          />
        )
      )}
      <button className="btn center">Go Back</button>
    </>
  );
};
