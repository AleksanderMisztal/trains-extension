import React, { useContext } from 'react';
import { GameContext } from '../../contexts/gameContext';
import { GameBase } from '../../types';

interface ContextType {
  user: { name: string };
  games: GameBase[];
}

export const GameContextConsumer = ({
  Component,
}: {
  Component: React.ComponentType<ContextType>;
}) => {
  const { user, games } = useContext(GameContext);
  return <Component user={user} games={games} />;
};
