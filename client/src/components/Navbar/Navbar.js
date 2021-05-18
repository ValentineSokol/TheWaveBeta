import React from 'react';
import NavigationLink from "../reusable/UIKit/NavigationLink/NavigationLink";
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/api';
import './Navbar.scss';
import logo from '../../img/navlogo.png';
import LanguageSelector from "../reusable/UIKit/LanguageSelector";

const Navbar = ({ user, logout, language, translations }) => {
 const onLogout = () => logout();
    return (
        <div className="Navbar">
            <img className='NavbarLogo' src={logo} alt="logo"/>
            <ul className="NavbarItems">
                <li>
                    <LanguageSelector />
                </li>
            <li><NavigationLink to='/'>{translations?.home}</NavigationLink></li>
            {
              user && user.isLoggedIn?
              <>
              <li><NavigationLink  to={`/profile/${user.id}`}>{translations?.profile}</NavigationLink></li>
              <li><NavigationLink to='/stories/post'>{translations?.post}</NavigationLink></li>
              <li onClick={onLogout} className='NavbarLogout'>{translations?.logout}</li>
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
const mapStateToProps = (state) => ({ user: state.global.user, language: state.preferences.language, translations: state.preferences.translations.navbar });
export default connect(mapStateToProps, { logout })(Navbar);