import React, { createContext, useCallback, useContext, useState } from 'react';
import { Slide, Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

const SnackBarContext = createContext<
  (message: string, severity?: Color, duration?: number) => void
>(null);

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("I'm a custom snackbar");
  const [duration, setDuration] = useState(2000);
  const [severity, setSeverity] = useState<Color>('success');

  const showMessage = useCallback(
    (message: string, severity = 'success', duration = 2000) => {
      setMessage(message);
      setSeverity(severity);
      setDuration(duration);
      setOpen(true);
    },
    []
  );
  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <SnackBarContext.Provider value={showMessage}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={duration}
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
      >
        <Alert
          variant="filled"
          onClose={() => setOpen(false)}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackBarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackBarContext);
