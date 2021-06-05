import React from 'react';
import NavigationLink from "../reusable/UIKit/NavigationLink/NavigationLink";
import { logout } from '../../redux/actions/api';
import {actions as preferencesAPI } from '../../redux/PreferencesSlice';
import './Navbar.scss';
import logo from '../../img/navlogo.png';
import LanguageSelector from "../reusable/UIKit/LanguageSelector";
import withTranslation from '../reusable/withTranslation/index';
import Button from '../reusable/UIKit/Forms/Button';

const Navbar = ({ isNavbarVisible, setNavbarVisibility, user, logout, translation }) => {
 const toggleNavbar = () => {
     setNavbarVisibility();
 }
 const onLogout = () => logout();
    return (
        <nav>
            <Button clickHandler={toggleNavbar}>{`Click here to ${isNavbarVisible? 'collapse' : 'expand'} the navigation bar.`}</Button>
            {
                isNavbarVisible &&
                    <div className="Navbar">
                        <img className='NavbarLogo' src={logo} alt="logo"/>
                        <ul className="NavbarItems">
                            <li className='LanguageSelectorLi'>
                                <LanguageSelector />
                            </li>
                            <li><NavigationLink to='/'>{translation?.home}</NavigationLink></li>
                            {
                                user && user.isLoggedIn?
                                    <>
                                        <li><NavigationLink  to={`/profile/${user.id}`}>{translation?.profile}</NavigationLink></li>
                                        <li><NavigationLink to='/stories/post'>{translation?.post}</NavigationLink></li>
                                        <li onClick={onLogout} className='NavbarLogout'>{translation?.logout}</li>
                                    </>
                                    :
                                    <>
                                        <li><NavigationLink to='/register'>{translation?.register}</NavigationLink></li>
                                    </>
                            }
                        </ul>
                    </div>
            }

        </nav>
    );
}

const mapStateToProps = (state) => ({
    user: state.global.user,
    isNavbarVisible: state.preferences.isNavbarVisible
});
const mapDispatchToProps = { logout, setNavbarVisibility: preferencesAPI.setNavbarVisibility };
export default withTranslation(Navbar, 'navbar', mapStateToProps, mapDispatchToProps);