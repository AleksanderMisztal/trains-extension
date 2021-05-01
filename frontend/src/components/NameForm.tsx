import React, { useContext, useState } from 'react';
import { GameContext } from '../contexts/gameContext';
import { useSnackbar } from '../contexts/snackbarContext';
import { backend } from '../services/backend';

export const NameForm = () => {
  const [input, setInput] = useState('');
  const addAlert = useSnackbar();
  const { setUser } = useContext(GameContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return addAlert('Name must be non empty.', 'error');
    const user = await backend.createUser(input);
    setUser(user);
  };

  return (
    <div className="card">
      <form action="submit" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          id="nameInput"
          autoComplete="off"
          placeholder="Name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn fit">
          Next
        </button>
      </form>
    </div>
  );
};
