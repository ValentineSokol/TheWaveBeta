import React from 'react';
import { Link  } from 'react-router-dom';
import '../../css/Navbar.css';
import logo from '../../img/navlogo.png';
export default function Navbar(props) {
    return (
        <div className="Navbar">
          <ul className="NavbarItems">
            <img className='NavbarLogo' src={logo} alt="logo"/>
            <li><Link to='/'>Home</Link></li>  
            <li><Link to='/register'>Register</Link></li>
            <li className='NavbarLogout'>Log Out</li>        
          </ul>  

        </div>
    )
}