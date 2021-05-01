import React from 'react';
import { SnackbarProvider } from './contexts/snackbarContext';
import { BrowserRouter } from 'react-router-dom';
import Trains from './components/Trains';

export const App = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <Trains />
      </SnackbarProvider>
    </BrowserRouter>
  );
};
