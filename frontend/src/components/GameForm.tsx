import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { GameContext } from '../contexts/gameContext';
import { useSnackbar } from '../contexts/snackbarContext';
import { backend } from '../services/backend';

export const GameForm = () => {
  const addAlert = useSnackbar();
  const history = useHistory();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { setCurrent } = useContext(GameContext);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return addAlert('Name must be non empty.', 'error');
    try {
      const game = await backend.createGame(name);
      setCurrent(game);
      history.push('/current');
    } catch (err) {
      addAlert("Can't create game", 'error');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) addAlert('Please input the game code.', 'error');
    try {
      const game = await backend.joinGame(code);
      setCurrent(game);
      history.push('/current');
    } catch (err) {
      addAlert("Can't find the game", 'error');
    }
  };

  return (
    <>
      <div className="card">
        <form action="submit" onSubmit={handleCreate}>
          <input
            type="text"
            name="name"
            id="nameInput"
            autoComplete="off"
            placeholder="Game name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn fit">
            Create Game
          </button>
        </form>
      </div>
      <div className="card">
        <form action="submit" onSubmit={handleJoin}>
          <input
            type="text"
            name="code"
            id="codeInput"
            autoComplete="off"
            placeholder="Game code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="btn fit">
            Join Game
          </button>
        </form>
      </div>
    </>
  );
};
