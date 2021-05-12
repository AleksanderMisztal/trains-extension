import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="topnav">
      <Link to="/">Home</Link>
      <Link to="/archive">Archive</Link>
    </div>
  );
};
