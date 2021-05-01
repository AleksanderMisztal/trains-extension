import React from 'react';
import { GameBase } from '../../types';
import { CurrentGame } from './CurrentGame';
import {
  CurrentGame as TCuG,
  ActiveGame as TAcG,
  ArchiveGame as TArG,
} from '../../types';
import { ArchiveGame } from './ArchiveGame';
import { ActiveGame } from './ActiveGame';

export const GameView = ({ game }: { game: GameBase }) => {
  if (!game) {
    return <>Game not defined</>;
  }
  if (game.type === 'current') return <CurrentGame />;
  if (game.type === 'active') return <ActiveGame game={game as TAcG} />;
  if (game.type === 'archive') return <ArchiveGame game={game as TArG} />;
};
