import React, { useEffect, useState } from 'react';
import { NameForm } from './NameForm';
import { GameForm } from './GameForm';
import { GameView } from './GameView';
import { FinalState } from './FinalState';
import { backend } from '../services/backend';
import { CurrentGame, GameBase, Phase, Uid } from '../types';

type View = { type: 'gameView' } | { type: 'resultsView'; gameUid: Uid };

export default function Trains({
  user,
  current,
  games,
}: {
  user: { name: string };
  current: CurrentGame;
  games: GameBase[];
}) {
  const [view, setView] = useState<View>({ type: 'gameView' });

  useEffect(() => {
    backend.getUser();
    backend.getGames();
    backend.getCurrentGame();
  }, []);

  const showGameResults = (gameUid: Uid) => {
    console.log('showing results of game ' + gameUid);
    setView({ type: 'resultsView', gameUid });
  };

  const backToHere = () => {
    setView({ type: 'gameView' });
  };

  useEffect(() => {}, [user, current]);

  const greeting = user && <div className="center">Hello {user.name}!</div>;

  let element: JSX.Element;
  if (!user) element = <NameForm />;
  else if (view.type === 'resultsView')
    element = (
      <FinalState
        game={games.find((g) => g.gameUid === view.gameUid)}
        goBack={backToHere}
      />
    );
  else if (!current)
    element = <GameForm games={games} onArchiveSelected={showGameResults} />;
  else if (current.phase !== Phase.Ended)
    element = <GameView current={current} />;

  return (
    <>
      {greeting}
      {element}
    </>
  );
}
