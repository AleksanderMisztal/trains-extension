import React from 'react';
import { backend } from '../../services/backend';
import { ActiveGame, Phase } from '../../types';

export const GameState = ({ current }: { current: ActiveGame }) => {
  const waiting = current.phase === Phase.Waiting;
  const inProgress = current.phase === Phase.InProgress;
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
          {current.players.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.ticketCounts.owned}</td>
              <td>{p.ticketCounts.pending}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {waiting && (
        <button
          className="btn center"
          onClick={() => backend.setPhase(Phase.Initial)}
        >
          All joined?
        </button>
      )}
      {inProgress && (
        <button
          className="btn center"
          onClick={() => backend.setPhase(Phase.Ended)}
        >
          End
        </button>
      )}
    </div>
  );
};
