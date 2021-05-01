import React from 'react';
import { GameBase } from '../../types';
import { CurrentGame } from './CurrentGame';
import {
  CurrentGame as TCuG,
  ActiveGame as TAcG,
  ArchiveGame as TArG,
} from '../../types';
import { ActiveGame } from './ActiveGame';
import { ArchiveGame } from './ArchiveGame';

export const GameView = ({ game }: { game: GameBase }) => {
  if (!game) {
    return <>Game not defined</>;
  }
  if (game.type === 'active') return <ActiveGame game={game as TAcG} />;
  if (game.type === 'current') return <CurrentGame game={game as TCuG} />;
  if (game.type === 'archive') return <ArchiveGame game={game as TArG} />;
};
