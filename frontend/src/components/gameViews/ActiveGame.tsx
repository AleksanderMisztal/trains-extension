import React from 'react';
import { ActiveGame as TActiveGame } from '../../types';
import { GameState } from './GameState';

export const ActiveGame = ({ game }: { game: TActiveGame }) => {
  return <GameState current={game} />;
};
