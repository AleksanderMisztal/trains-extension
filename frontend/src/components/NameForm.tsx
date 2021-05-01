import React, { useState } from 'react';
import { useSnackbar } from '../contexts/snackbarContext';

export const NameForm = ({
  onCreated,
}: {
  onCreated: (name: string) => void;
}) => {
  const [input, setInput] = useState('');
  const addAlert = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return addAlert('Name must be non empty.', 'error');
    onCreated(input);
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
