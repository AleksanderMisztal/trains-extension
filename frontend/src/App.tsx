import React from 'react';
import { SnackbarProvider } from './contexts/snackbarContext';
import { BrowserRouter } from 'react-router-dom';
import Trains from './components/Trains';
import { GameContextProvider } from './contexts/gameContext';

export const App = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <GameContextProvider>
          <Trains />
        </GameContextProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
};
