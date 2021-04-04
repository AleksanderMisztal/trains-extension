import React, { useState } from 'react';
import { useSnackbar } from '../contexts/snackbarContext';
import { backend } from '../services/backend';

export const NameForm = () => {
  const [input, setInput] = useState('');
  const addAlert = useSnackbar();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) {
      addAlert('Name must be non empty.', 'error');
      return;
    }
    backend.createUser(input);
    addAlert('User created');
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
