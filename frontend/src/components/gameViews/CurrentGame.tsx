import React, { useContext } from 'react';
import { Phase } from '../../types';
import { PendingTickets } from './PendingTickets';
import { Tickets } from './Tickets';
import { backend } from '../../services/backend';
import { useSnackbar } from '../../contexts/snackbarContext';
import { GameContext } from '../../contexts/gameContext';
import { useHistory } from 'react-router';

export const CurrentGame = () => {
  const history = useHistory();
  const { current, setCurrent, setArchives } = useContext(GameContext);
  const addAlert = useSnackbar();
  if (!current) return <>Loading...</>;

  const returnTickets = async (toKeep: boolean[]) => {
    if (toKeep.filter((k) => k).length === 0)
      return addAlert('Keep at least one ticket', 'error');
    const current = await backend.returnTickets(toKeep);
    setCurrent(current);
  };

  const takeTickets = async () => {
    const current = await backend.takeTickets();
    setCurrent(current);
  };

  const beginGame = async () => {
    const current = await backend.beginGame();
    setCurrent(current);
  };

  const endGame = async () => {
    const ended = await backend.endGame();
    setArchives((archives) => [ended, ...archives]);
    history.push(`/archive/${current.uid}`);
  };

  const waiting = current.phase === Phase.Waiting;
  const inProgress = current.phase === Phase.InProgress;
  console.log({ current });

  return (
    <>
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
          <>
            Game code: {current.code}
            <button className="btn center" onClick={beginGame}>
              All joined?
            </button>
          </>
        )}
        {inProgress && (
          <button className="btn center" onClick={endGame}>
            End
          </button>
        )}
      </div>
      {!waiting && (
        <>
          <PendingTickets
            tickets={current.tickets.pending}
            onReturn={returnTickets}
            takeTickets={takeTickets}
          />
          <Tickets title="Owned tickets" tickets={current.tickets.owned} />
        </>
      )}
    </>
  );
};
