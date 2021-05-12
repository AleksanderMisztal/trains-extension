import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { backend } from '../services/backend';
import { ArchiveGame, CurrentGame } from '../types';

export const GameContext = createContext<{
  user: { name: string };
  setUser: Dispatch<SetStateAction<{ name: string }>>;
  current: CurrentGame;
  setCurrent: Dispatch<SetStateAction<CurrentGame>>;
  archives: ArchiveGame[];
  setArchives: Dispatch<SetStateAction<ArchiveGame[]>>;
}>({
  user: undefined,
  current: undefined,
  setUser: undefined,
  setCurrent: undefined,
  archives: undefined,
  setArchives: undefined,
});

export const GameContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [current, setCurrent] = useState<CurrentGame>(undefined);
  const [archives, setArchives] = useState<ArchiveGame[]>(undefined);

  useEffect(() => {
    if (user) return;
    (async () => {
      const user = await backend.getUser();
      setUser(user);
      const archives = await backend.getArchives();
      setArchives(archives);
      const current = await backend.getCurrentGame();
      setCurrent(current);
    })();
  }, []);

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        current,
        setCurrent,
        archives,
        setArchives,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
