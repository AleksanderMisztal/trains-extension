import React from 'react';
import { useHistory } from 'react-router';

export const NotFoundPage = () => {
  const history = useHistory();
  return (
    <div className="card">
      <div className="center">Page not found</div>
      <button className="btn center" onClick={() => history.push('/')}>
        Home
      </button>
      <button className="btn center" onClick={() => history.goBack()}>
        Go back
      </button>
    </div>
  );
};
