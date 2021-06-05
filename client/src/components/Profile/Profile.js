import React, { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router';
import { connect } from 'react-redux';
import { loadProfile } from '../../redux/actions/api';

import './Profile.scss';
import Card from "../reusable/UIKit/Cards/Card/Card";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import defaultAvatar from '../../assets/defaultAvatar.webp';
import Button from "../reusable/UIKit/Forms/Button";

const Profile = ({ dispatch, loadedUser, loggedInUser }) => {
    const [isOwner, setisOwner] = useState(false);
    const { id } = useParams();
    const history = useHistory();
    useEffect(
        () => {
            dispatch(loadProfile(id));
            if (loggedInUser && loggedInUser.id === id) setisOwner(true);
        },
        [id]
    );
        const user = isOwner? loggedInUser : loadedUser;
        return (
         !user? null
         :
        <div className='ProfileContainer'>
           <section>
           <Card>
            <div className='ProfileAvatar'>
             <img src={user.avatarUrl || defaultAvatar} alt='profile' />
            </div>
           </Card>
            <div className='ProfileUserActions'>
                <Button clickHandler={() => history.push(`/chat/direct/${user.id}`) }>Message!</Button>
            </div>
           </section>
            <div className='ProfileInfo'>
                <Heading size='2'>{user.username}</Heading>
                <span>{user.privilege}</span>
            </div>
        </div>
      );
}
const mapStateToProps = (state) => ({ loginChecked: state.global.loginChecked,  loadedUser: state.global.loadedUser, loggedInUser: state.global.user });
export default connect(mapStateToProps, null)(Profile); 