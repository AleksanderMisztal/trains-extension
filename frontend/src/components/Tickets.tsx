import React, { useState } from 'react';
import { Ticket } from '../types';
import { Checkbox } from './checkbox';

export const Tickets: React.FC<{
  title: string;
  tickets: Ticket[];
}> = ({ title, tickets }) => {
  const [completed, setCompleted] = useState<boolean[]>(
    Array.from({ length: tickets.length }, (v, i) => false)
  );

  const handleToggleCompleted = (i: number) => {
    setCompleted((prev) => {
      const newCompleted = [...completed];
      newCompleted[i] = !prev[i];
      return newCompleted;
    });
  };

  const getPoints = () => {
    return Array.from({ length: tickets.length }, (v, i: number) => {
      return completed[i] ? tickets[i].points : -tickets[i].points;
    }).reduce((a, b) => a + b, 0);
  };

  while (completed.length < tickets.length) completed.push(false);

  if (tickets.length === 0) return <></>;
  return (
    <div className="card">
      <table>
        <caption>
          {title}
          <br /> Total points: {getPoints()}
        </caption>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={i}>
              <td>{t.city1}</td>
              <td>{t.city2}</td>
              <td>{t.points}</td>
              <td>
                <Checkbox
                  checked={completed[i]}
                  onChange={() => handleToggleCompleted(i)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
