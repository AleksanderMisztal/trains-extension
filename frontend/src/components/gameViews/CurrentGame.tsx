import React, { useContext } from 'react';
import { Phase } from '../../types';
import { PendingTickets } from './PendingTickets';
import { ActiveGame } from './ActiveGame';
import { Tickets } from './Tickets';
import { backend } from '../../services/backend';
import { useSnackbar } from '../../contexts/snackbarContext';
import { GameContext } from '../../contexts/gameContext';

export const CurrentGame = () => {
  const { getCurrent, setCurrent } = useContext(GameContext);
  const current = getCurrent();
  const addAlert = useSnackbar();
  if (!current) return <>Loading...</>;
  const waiting = current.phase === Phase.Waiting;

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

  return (
    <>
      <ActiveGame game={current} />
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
