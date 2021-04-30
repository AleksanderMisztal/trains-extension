import React from 'react';
import { Tickets } from './Tickets';
import { ArchiveGame as TArchiveGame } from '../../types';
import { useHistory } from 'react-router';

export const ArchiveGame = ({ game }: { game: TArchiveGame }) => {
  const history = useHistory();
  return (
    <>
      {game.players.map((p, i) => (
        <Tickets
          key={i}
          title={p.name + "'s tickets"}
          tickets={p.tickets.owned}
        />
      ))}
      <button className="btn center" onClick={() => history.push('/')}>
        Home
      </button>
    </>
  );
};
