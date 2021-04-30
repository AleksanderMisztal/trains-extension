import React, { useEffect, useState } from 'react';
import { NameForm } from './NameForm';
import { GameForm } from './GameForm';
import { GameView } from './gameViews/GameView';
import { FinalState } from './gameViews/FinalState';
import { backend } from '../services/backend';
import { GameBase, Uid } from '../types';
import { Switch, Route, useHistory } from 'react-router';
import { NotFoundPage } from './common/NotFoundPage';

export default function Trains({
  user,
  games,
}: {
  user: { name: string };
  games: GameBase[];
}) {
  const history = useHistory();
  const [selectedUid, setSelectedUid] = useState<Uid>(null);
  useEffect(() => {
    (async () => {
      await backend.getUser();
      backend.getGames();
    })();
  }, []);

  const current = games.find((g) => g.type === 'current');
  const selected = games.find((g) => g.gameUid === selectedUid);

  return (
    <>
      {current && (
        <button className="btn center" onClick={() => history.push('/current')}>
          Current game
        </button>
      )}
      <Switch>
        <Route path="/" exact>
          {user && <div className="center">Hello {user.name}!</div>}
          {!user ? <NameForm /> : <GameForm games={games} />}
        </Route>
        <Route path="/game/:uid"></Route>
        <Route path="/current">
          <GameView game={current} />
        </Route>
        <Route path={'/final'}>
          <FinalState game={null} />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
