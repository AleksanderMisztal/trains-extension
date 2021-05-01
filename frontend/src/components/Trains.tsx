import React, { useContext } from 'react';
import { NameForm } from './NameForm';
import { GameForm } from './GameForm';
import { GameView } from './gameViews/GameView';
import { Switch, Route } from 'react-router';
import { NotFoundPage } from './common/NotFoundPage';
import { GameContext } from '../contexts/gameContext';

export default function Trains() {
  const { user, games } = useContext(GameContext);

  return (
    <>
      <Switch>
        <Route path="/" exact>
          {user && <div className="center">Hello {user.name}!</div>}
          {!user ? <NameForm /> : <GameForm />}
        </Route>
        <Route
          path="/game/:uid"
          children={({ match }) => (
            <GameView
              game={games.find((g) => g.gameUid === match.params.uid)}
            />
          )}
        />
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </>
  );
}
