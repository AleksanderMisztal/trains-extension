import React, { useContext } from 'react';
import { GameContext } from '../../contexts/gameContext';
import { backend } from '../../services/backend';
import { ActiveGame as AG, ArchiveGame, CurrentGame, Phase } from '../../types';

export const ActiveGame = ({ game }: { game: AG }) => {
  const { setCurrent, endCurrent } = useContext(GameContext);
  const beginGame = async () => {
    const curr = (await backend.setPhase(Phase.Initial)) as CurrentGame;
    setCurrent(curr);
  };

  const endGame = async () => {
    const curr = (await backend.setPhase(Phase.Ended)) as ArchiveGame;
    endCurrent(curr);
  };

  const waiting = game.phase === Phase.Waiting;
  const inProgress = game.phase === Phase.InProgress;
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owned</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {game.players.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.ticketCounts.owned}</td>
              <td>{p.ticketCounts.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {waiting && (
        <button className="btn center" onClick={beginGame}>
          All joined?
        </button>
      )}
      {inProgress && (
        <button className="btn center" onClick={endGame}>
          End
        </button>
      )}
    </div>
  );
};
