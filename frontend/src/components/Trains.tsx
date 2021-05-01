import React, { useEffect, useState } from 'react';
import { NameForm } from './NameForm';
import { GameForm } from './GameForm';
import { GameView } from './gameViews/GameView';
import { backend } from '../services/backend';
import { GameBase } from '../types';
import { Switch, Route, useHistory, Redirect } from 'react-router';
import { NotFoundPage } from './common/NotFoundPage';
import { useSnackbar } from '../contexts/snackbarContext';

export default function Trains() {
  const history = useHistory();
  const addAlert = useSnackbar();

  const [user, setUser] = useState(undefined);
  const [games, setGames] = useState<GameBase[]>([]);

  useEffect(() => {
    (async () => {
      const user = await backend.getUser();
      const games = await backend.getGames();
      setUser(user);
      setGames(games);
    })();
  }, []);

  const current = games.find((g) => g.type === 'current');

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
          {!user ? (
            <NameForm
              onCreated={async (name: string) => {
                const user = await backend.createUser(name);
                setUser(user);
                addAlert('User created');
              }}
            />
          ) : (
            <GameForm
              games={games}
              onNewGame={(g) => setGames((gs) => [...gs, g])}
            />
          )}
        </Route>
        <Route
          path="/game/:uid"
          children={({ match }) => (
            <GameView
              game={games.find((g) => g.gameUid === match.params.uid)}
            />
          )}
        />
        <Route path="/current">
          <Redirect to={current ? `/game/${current.gameUid}` : '/'} />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </>
  );
}
