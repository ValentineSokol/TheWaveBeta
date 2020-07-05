import React from 'react';
import '../../css/Navbar.css';
import logo from '../../img/navlogo.png';
export default function Navbar(props) {
    return (
        <div className="Navbar">
          <ul className="NavbarItems">
            <img className='NavbarLogo' src={logo} alt="logo"/>  
            <li>Profile</li>
            <li>Write</li>
            <li>Read</li>
            <li>Chat</li>
            <li className='NavbarLogout'>Log Out</li>        
          </ul>  

        </div>
    )
}