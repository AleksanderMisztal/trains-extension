import React, { useState, useEffect } from 'react';
import { useSnackbar } from '../contexts/snackbarContext';
import { backend } from '../services/backend';
import { ActiveGame, ArchiveGame, GameBase, Phase } from '../types';

export const GameForm = ({ games }: { games: GameBase[] }) => {
  const [input, setInput] = useState('');
  const addAlert = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) {
      addAlert('Name must be non empty.', 'error');
      return;
    }
    await backend.createGame(input);
    setInput('');
  };

  const availableGames = games.filter(
    (g): g is ActiveGame => g.phase === Phase.Waiting
  );
  const endedGames: ArchiveGame[] = games.filter(
    (g): g is ArchiveGame => g.type === 'archive'
  );

  return (
    <div>
      {availableGames.length !== 0 && (
        <div className="card" id="available-games">
          Available games
          <table className="table">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Players</th>
              </tr>
              {availableGames.map((g, i) => (
                <tr key={i}>
                  <td>{g.name}</td>
                  <td>{g.maxPlayers}</td>
                  <td
                    className="btn"
                    onClick={() => backend.joinGame(g.gameUid)}
                  >
                    Join
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="card">
        <form action="submit" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="nameInput"
            autoComplete="off"
            placeholder="Game name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn fit">
            Create Game
          </button>
        </form>
      </div>
      <div className="card">
        Ended games
        <table className="table">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Players</th>
            </tr>
            {endedGames.map((g, i) => (
              <tr key={i}>
                <td>{g.name}</td>
                <td>{g.maxPlayers}</td>
                <td className="btn" onClick={() => {}}>
                  Results
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
