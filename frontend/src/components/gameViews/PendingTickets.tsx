import React, { useState, useEffect } from 'react';
import { Checkbox } from '../common/form/Checkbox';
import { Ticket } from '../../types';

export const PendingTickets = ({
  tickets,
  onReturn,
  takeTickets,
}: {
  tickets: Ticket[];
  onReturn: any;
  takeTickets: any;
}) => {
  const [toKeep, setToKeep] = useState<boolean[]>(
    Array.from({ length: tickets.length }, (_i) => false)
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

  if (tickets.length === 0)
    return (
      <button className="btn center" onClick={takeTickets}>
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
      <button className="btn center" onClick={() => onReturn(toKeep)}>
        Keep selected
      </button>
    </div>
  );
};
