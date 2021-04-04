import React, { useContext } from 'react';
import { GameContext } from '../contexts/gameContext';
import Trains from './Trains';

export const GameContextConsumer = () => {
  const { user, current, games } = useContext(GameContext);
  return <Trains user={user} current={current} games={games} />;
};
