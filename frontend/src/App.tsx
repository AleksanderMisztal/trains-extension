import React from 'react';
import { GameContextProvider } from './contexts/gameContext';
import { SnackbarProvider } from './contexts/snackbarContext';
import { GameContextConsumer } from './components/GameContextConsumer';

export const App = () => {
  return (
    <SnackbarProvider>
      <GameContextProvider>
        <GameContextConsumer />
      </GameContextProvider>
    </SnackbarProvider>
  );
};
