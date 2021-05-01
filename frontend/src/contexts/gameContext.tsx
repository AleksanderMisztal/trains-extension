import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { backend } from '../services/backend';
import { ArchiveGame, CurrentGame, GameBase } from '../types';

export const GameContext = createContext<{
  user: { name: string };
  games: GameBase[];
  getCurrent: () => CurrentGame;
  setUser: Dispatch<SetStateAction<{ name: string }>>;
  setGames: React.Dispatch<SetStateAction<GameBase[]>>;
  setCurrent: (game: CurrentGame) => void;
  endCurrent: (game: ArchiveGame) => void;
}>({
  user: undefined,
  games: [],
  getCurrent: undefined,
  setUser: undefined,
  setGames: undefined,
  setCurrent: undefined,
  endCurrent: undefined,
});

export const GameContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [games, setGames] = useState<GameBase[]>([]);

  const getCurrent = (): CurrentGame =>
    games.find((g) => g.type === 'current') as CurrentGame;
  const setCurrent = (game: CurrentGame) => {
    if (game.type !== 'current')
      throw new Error('cant set current to not current');
    setGames((gs) => gs.map((g) => (g.gameUid === game.gameUid ? game : g)));
  };
  const endCurrent = (ended: ArchiveGame) => {
    setGames((gs) => gs.map((g) => (g.gameUid === ended.gameUid ? ended : g)));
  };

  useEffect(() => {
    if (user && games) return;
    (async () => {
      const user = await backend.getUser();
      const games = await backend.getGames();
      setUser(user);
      setGames(games);
      const current = games.find((g) => g.type === 'current');
      if (current) setCurrent(current as CurrentGame);
    })();
  }, []);

  return (
    <GameContext.Provider
      value={{
        user,
        games,
        getCurrent,
        setUser,
        setGames,
        setCurrent,
        endCurrent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
