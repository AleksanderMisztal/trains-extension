import React, { useState, useEffect } from 'react';
import { Checkbox } from '../common/checkbox';
import { backend } from '../../services/backend';
import { useSnackbar } from '../../contexts/snackbarContext';
import { Ticket } from '../../types';

export const PendingTickets = ({ tickets }: { tickets: Ticket[] }) => {
  const addAlert = useSnackbar();

  const [toKeep, setToKeep] = useState<boolean[]>(
    Array.from({ length: tickets.length }, (i) => false)
  );

  useEffect(() => {
    const keepNone = Array.from({ length: tickets.length }, (i) => false);
    setToKeep(keepNone);
  }, [tickets]);

  const handleToggleKeep = (i: number) => {
    setToKeep((prev) => {
      const toKeep = [...prev];
      toKeep[i] = !toKeep[i];
      return toKeep;
    });
  };

  const returnTickets = () => {
    if (toKeep.filter((k) => k).length === 0) {
      addAlert('Keep at least one ticket', 'error');
      return;
    }
    backend.returnTickets(toKeep);
  };

  if (tickets.length === 0)
    return (
      <button className="btn center" onClick={backend.takeTickets}>
        Take
      </button>
    );

  return (
    <div className="card">
      <table>
        <caption>Pending tickets</caption>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={i}>
              <td>{t.city1}</td>
              <td>{t.city2}</td>
              <td>{t.points}</td>
              <td>
                <Checkbox
                  checked={toKeep[i]}
                  onChange={() => handleToggleKeep(i)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn center" onClick={returnTickets}>
        Keep selected
      </button>
    </div>
  );
};
