import React from 'react';
import { GameContextProvider } from './contexts/gameContext';
import { SnackbarProvider } from './contexts/snackbarContext';
import { GameContextConsumer } from './components/common/GameContextConsumer';
import { BrowserRouter } from 'react-router-dom';
import Trains from './components/Trains';

export const App = () => {
  return (
    <SnackbarProvider>
      <GameContextProvider>
        <BrowserRouter>
          <GameContextConsumer Component={Trains} />
        </BrowserRouter>
      </GameContextProvider>
    </SnackbarProvider>
  );
};
