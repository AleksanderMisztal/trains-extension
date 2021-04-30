import React, { useReducer, FC } from 'react';
import { GameBase, CurrentGame, ActiveGame } from '../types.js';

interface State {
  games: GameBase[];
  user?: { name: string };
}

type Action =
  | { type: 'setuser'; user: { name: string } }
  | { type: 'setgames'; games: GameBase[] }
  | { type: 'addgame'; game: ActiveGame }
  | { type: 'modifygame'; game: GameBase };

const initState: State = {
  user: undefined,
  games: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setuser':
      return { ...state, user: action.user };
    case 'setgames':
      return { ...state, games: action.games };
    case 'addgame':
      return { ...state, games: [...state.games, action.game] };
    case 'modifygame':
      const next = { ...state };
      const idx = next.games.findIndex(
        (g) => g.gameUid === action.game.gameUid
      );
      next.games[idx] = action.game;
      return next;
    default:
      throw new Error();
  }
};

export const store: { isReady: boolean; dispatch: React.Dispatch<Action> } = {
  isReady: false,
  dispatch: () => {
    console.error('store is NOT ready');
  },
};
const loggingReducer = (state: State, action: Action): State => {
  const next = reducer(state, action);
  console.log(next);
  return next;
};

export const GameContext = React.createContext(initState);

export const GameContextProvider: FC<{ children?: React.ReactNode }> = (
  props
) => {
  const [state, dispatch] = useReducer(loggingReducer, initState);

  store.isReady = true;
  store.dispatch = dispatch;

  return (
    <GameContext.Provider value={state}>{props.children}</GameContext.Provider>
  );
};
