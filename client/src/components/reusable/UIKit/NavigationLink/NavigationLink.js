import React from "react";
import { NavLink } from 'react-router-dom';
import './NavigationLink.scss';

const NavigationLink = ({ to, children }) => (
  <NavLink to={to} exact className='NavigationLink' activeClassName='Active' >
      {children}
  </NavLink>
);

export default NavigationLink;