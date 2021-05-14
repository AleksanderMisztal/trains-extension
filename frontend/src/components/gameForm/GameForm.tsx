import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { GameContext } from '../../contexts/gameContext';
import { useSnackbar } from '../../contexts/snackbarContext';
import { backend } from '../../services/backend';
import { StackOptions } from '../../types';
import { ConfirmingButton } from '../common/ConfirmingButton';
import { Modal } from '../common/Modal';
import { StackForm } from './StackForm';

const initialState: StackOptions = {
  initkeep: 2,
  inittake: {},
  stdtake: 3,
  stdkeep: 1,
};

type Action =
  | { type: 'inittake'; name: string; take: number }
  | { type: 'initkeep'; keep: number }
  | { type: 'stdtake'; take: number }
  | { type: 'stdkeep'; keep: number };

const reducer = (state: StackOptions, action: Action): StackOptions => {
  switch (action.type) {
    case 'inittake': {
      const { name, take } = action;
      const inittake = { ...state.inittake, [name]: take };
      return { ...state, inittake };
    }
    case 'initkeep':
      return { ...state, initkeep: action.keep };

    case 'stdtake':
      return { ...state, stdtake: action.take };

    case 'stdkeep':
      return { ...state, stdkeep: action.keep };
  }
};

export const GameForm = () => {
  const addAlert = useSnackbar();
  const history = useHistory();
  const { current, setCurrent, decks } = useContext(GameContext);
  const [name, setName] = useState('');
  const [deck, setDeck] = useState<string>('std');
  const [code, setCode] = useState('');
  const [showDeck, setShowDeck] = useState(false);

  const [s, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!decks[deck]) return;
    Object.keys(decks[deck]).forEach((dn) =>
      dispatch({ type: 'inittake', name: dn, take: 2 })
    );
  }, [decks, deck]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return addAlert('Name must be non empty.', 'error');
    try {
      const game = await backend.createGame(name, deck, s);
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

  if (current)
    return (
      <button className="btn center" onClick={() => history.push('/current')}>
        Current game
      </button>
    );

  if (!decks[deck]) return <>'Loading'</>;

  return (
    <>
      <Modal isOpen={showDeck}>
        {Object.keys(decks[deck] || {}).map((k) => (
          <ul key={k}>
            <h3>{k}</h3>
            {decks[deck][k].map((t, i) => (
              <li key={i}>
                {t.city1}--
                {t.city2}:{t.points}
              </li>
            ))}
          </ul>
        ))}
        <button className="btn" onClick={() => setShowDeck(false)}>
          Hide
        </button>
      </Modal>
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
          <select value={deck} onChange={(e) => setDeck(e.target.value)}>
            {Object.keys(decks).map((k) => (
              <option value={k} key={k}>
                {k}
              </option>
            ))}
          </select>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowDeck(true);
            }}
          >
            Show deck
          </button>
          <br />
          <StackForm s={s} dispatch={dispatch} />
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
