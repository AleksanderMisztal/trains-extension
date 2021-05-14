import React, { useContext } from 'react';
import { NameForm } from './NameForm';
import { GameForm } from './gameForm/GameForm';
import { Switch, Route } from 'react-router';
import { NotFoundPage } from './common/NotFoundPage';
import { GameContext } from '../contexts/gameContext';
import { ArchiveGame } from './gameViews/ArchiveGame';
import { CurrentGame } from './gameViews/CurrentGame';
import { Archives } from './gameViews/Archives';
import { Navbar } from './common/Navbar';

export default function Trains() {
  const { user, archives } = useContext(GameContext);

  return (
    <>
      <Navbar />
      <div className="container">
        <Switch>
          <Route path="/" exact>
            {user && <h3>Hello {user.name}!</h3>}
            {user ? <GameForm /> : <NameForm />}
          </Route>
          <Route
            path="/archive/:uid"
            children={({ match }) =>
              archives ? (
                <ArchiveGame
                  game={archives.find((g) => g.uid === match.params.uid)}
                />
              ) : (
                <>Loading</>
              )
            }
          />
          <Route path="/current">
            <CurrentGame />
          </Route>
          <Route path="/archive">
            <Archives />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </div>
    </>
  );
}
