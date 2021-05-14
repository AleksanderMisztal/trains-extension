import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { backend } from '../services/backend';
import { ArchiveGame, CurrentGame, TicketSet } from '../types';

export const GameContext = createContext<{
  user: { name: string };
  setUser: Dispatch<SetStateAction<{ name: string }>>;
  current: CurrentGame;
  setCurrent: Dispatch<SetStateAction<CurrentGame>>;
  archives: ArchiveGame[];
  setArchives: Dispatch<SetStateAction<ArchiveGame[]>>;
  decks: { [name: string]: TicketSet };
  setSets: Dispatch<SetStateAction<{ [name: string]: TicketSet }>>;
}>({
  user: undefined,
  current: undefined,
  setUser: undefined,
  setCurrent: undefined,
  archives: undefined,
  setArchives: undefined,
  decks: undefined,
  setSets: undefined,
});

export const GameContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [current, setCurrent] = useState<CurrentGame>(undefined);
  const [archives, setArchives] = useState<ArchiveGame[]>(undefined);
  const [decks, setSets] = useState<{ [name: string]: TicketSet }>({});

  useEffect(() => {
    if (user && decks.std) return;
    (async () => {
      const user = await backend.getUser();
      setUser(user);
      const decks = await backend.getSets();
      setSets(decks);
      const archives = await backend.getArchives();
      setArchives(archives);
      const current = await backend.getCurrentGame();
      setCurrent(current);
    })();
  }, [user]);

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        current,
        setCurrent,
        archives,
        setArchives,
        decks,
        setSets,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
