import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="topnav">
      <NavLink activeClassName="active" exact={true} to="/">
        Home
      </NavLink>
      <NavLink activeClassName="active" exact={true} to="/current">
        Current
      </NavLink>
      <NavLink activeClassName="active" exact={true} to="/archive">
        Archive
      </NavLink>
    </div>
  );
};
