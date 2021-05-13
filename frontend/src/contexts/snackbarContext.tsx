import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type Color = 'success' | 'error';

const SnackBarContext =
  createContext<(message: string, severity?: Color, duration?: number) => void>(
    null
  );

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("I'm a custom snackbar");
  const [severity, setSeverity] = useState<Color>('success');
  const timers = useRef([]);

  const showMessage = useCallback(
    (message: string, severity = 'success', duration = 3000) => {
      timers.current.forEach(clearTimeout);
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
      }, duration);
      timers.current.push(timer);
    },
    []
  );
  return (
    <SnackBarContext.Provider value={showMessage}>
      {children}
      <div id="snackbar" className={severity + (open ? ' show' : ' hide')}>
        {message}
      </div>
    </SnackBarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackBarContext);
