import React from 'react';
import NavigationLink from "./UIKit/NavigationLink/NavigationLink";
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/async';
import '../../scss/Navbar.scss';
import logo from '../../img/navlogo.png';

const Navbar = ({ user }) => {
 const onLogout = () => this.props.dispatch(logout());
    return (
        <div className="Navbar">
          <ul className="NavbarItems">
            <img className='NavbarLogo' src={logo} alt="logo"/>
            <li><NavigationLink to='/'>Home</NavigationLink></li>
            {
              user && user.isLoggedIn?
              <>
              <li><NavigationLink  to={`/profile/${user.id}`}>Profile</NavigationLink></li>
              <li><NavigationLink to='/stories/post'>Post</NavigationLink></li>
              <li><NavigationLink to='/search'>Search</NavigationLink></li>
              <li onClick={onLogout} className='NavbarLogout'>Log Out</li>
              </>  
              :
              <>
                <li><NavigationLink to='/register'>Register</NavigationLink></li>
              </>
            }
          </ul>  

        </div>
    );
}
const mapStateToProps = (state) => ({ user: state.global.user });
export default connect(mapStateToProps, null)(Navbar);