import React from 'react';
import NavigationLink from "../reusable/UIKit/NavigationLink/NavigationLink";
import { logout } from '../../redux/actions/api';
import {actions as preferencesAPI } from '../../redux/PreferencesSlice';
import './Navbar.scss';
import { faHouseUser, faCommentDots, faSignOutAlt, faCog, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import withTranslation from '../reusable/withTranslation/index';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import classNames from 'classnames';

const Navbar = ({ user, logout, queryParams }) => {
    const onLogout = () => logout();
    return (
        <nav>
            <ul className={classNames(
                'NavbarItems',
                {'InChat': !!queryParams.id}
            )}>
                {
                    user && user.isLoggedIn ?
                        <>
                            <li><NavigationLink to={`/profile/${user.id}`}>
                                <FontAwesomeIcon icon={faHouseUser}/>
                            </NavigationLink></li>
                            <li><NavigationLink to='/chat'>
                                <FontAwesomeIcon icon={faCommentDots}/>
                            </NavigationLink></li>
                            <li><NavigationLink to={'/settings'}>
                                <FontAwesomeIcon icon={faCog}/>
                            </NavigationLink></li>
                            <li onClick={onLogout} className='NavbarLogout'>{
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                            }</li>
                        </>
                        :
                        <>
                            <li><NavigationLink to='/register'>{
                                <FontAwesomeIcon icon={faDoorOpen}/>
                            }</NavigationLink></li>
                        </>
                }
            </ul>
        </nav>
    );
}

const mapStateToProps = (state) => ({
    user: state.global.user,
    queryParams: state.global.queryParams
});
const mapDispatchToProps = { logout, setNavbarVisibility: preferencesAPI.setNavbarVisibility };
export default withTranslation(Navbar, 'navbar', mapStateToProps, mapDispatchToProps);