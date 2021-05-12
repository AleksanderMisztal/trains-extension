import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { GameContext } from '../../contexts/gameContext';

export const Archives = () => {
  const { archives } = useContext(GameContext);
  const history = useHistory();
  if (!archives) return <>loading</>;
  return (
    <>
      <div className="card">
        Ended games
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Players</th>
            </tr>
            {archives.map((g, i) => (
              <tr key={i}>
                <td>{g.name}</td>
                <td>{g.players.length}</td>
                <td
                  className="btn"
                  onClick={() => history.push('/archive/' + g.uid)}
                >
                  Results
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
