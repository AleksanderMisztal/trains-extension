import React, { useContext } from 'react';
import { Phase } from '../../types';
import { PendingTickets } from './PendingTickets';
import { Tickets } from './Tickets';
import { backend } from '../../services/backend';
import { useSnackbar } from '../../contexts/snackbarContext';
import { GameContext } from '../../contexts/gameContext';
import { useHistory } from 'react-router';
import { ConfirmingButton } from '../common/ConfirmingButton';

export const CurrentGame = () => {
  const history = useHistory();
  const { current, setCurrent, setArchives } = useContext(GameContext);
  const addAlert = useSnackbar();
  if (!current) return <div className="center">No current games found...</div>;

  const returnTickets = async (toKeep: boolean[]) => {
    try {
      const current = await backend.returnTickets(toKeep);
      setCurrent(current);
    } catch (err) {
      addAlert('Keep more tickets!', 'error');
    }
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
    setCurrent(undefined);
    setArchives((archives) => [ended, ...archives]);
    history.push(`/archive/${current.uid}`);
  };

  const waiting = current.phase === Phase.Waiting;
  const inProgress = current.phase === Phase.InProgress;

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
            <ConfirmingButton
              warning="Other players will not be able to join. Continue?"
              action={beginGame}
            >
              All joined?
            </ConfirmingButton>
          </>
        )}
        {inProgress && (
          <ConfirmingButton
            warning="The game will end immediately."
            action={endGame}
          >
            End
          </ConfirmingButton>
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
