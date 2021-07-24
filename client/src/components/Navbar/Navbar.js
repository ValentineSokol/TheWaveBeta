import React from 'react';
import NavigationLink from "../reusable/UIKit/NavigationLink/NavigationLink";
import { logout } from '../../redux/actions/api';
import {actions as preferencesAPI } from '../../redux/PreferencesSlice';
import './Navbar.scss';
import logo from '../../img/navlogo.png';
import NavbarButtonPanel from "../reusable/UIKit/NavbarButtonPanel";
import withTranslation from '../reusable/withTranslation/index';
import settingsIcon from '../../assets/settings.svg';

const Navbar = ({ isNavbarVisible, user, logout, translation }) => {
 const onLogout = () => logout();
    return (
        <nav>
            {
                isNavbarVisible &&
                    <div className="Navbar">
                        <img className='NavbarLogo' src={logo} alt="logo"/>
                        <ul className="NavbarItems">
                            <li className='NavbarButtonPanelLi'>
                                <NavbarButtonPanel />
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