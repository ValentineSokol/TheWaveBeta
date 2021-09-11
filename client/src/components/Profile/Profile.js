import React, { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router';
import { connect } from 'react-redux';
import { loadProfile } from '../../redux/actions/api';

import './Profile.scss';
import Card from "../reusable/UIKit/Cards/Card/Card";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import Button from "../reusable/UIKit/Forms/Button";
import Avatar from "../reusable/Avatar";
import ChangeAvatarModal from "./ChangeAvatarModal";

const Profile = ({ dispatch, loadedUser, loggedInUser }) => {
    const [isOwner, setisOwner] = useState(false);
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const { id } = useParams();
    const history = useHistory();
    useEffect(
        () => {
            dispatch(loadProfile(id));
            if (loggedInUser && Number(loggedInUser.id) === Number(id)) setisOwner(true);
        },
        [id, dispatch, loggedInUser]
    );
        const user = isOwner? loggedInUser : loadedUser;
        return (
         !user? null
         :
        <div className='ProfileContainer'>
           <ChangeAvatarModal onClose={_ => setIsChangingAvatar(false)} isOpen={isChangingAvatar} />
           <section>
           <Card classes='AvatarCard'>
            <div className='ProfileAvatar'>
                <Avatar clickHandler={() => isOwner && setIsChangingAvatar(true)} url={user.avatarUrl} />
            </div>
           </Card>
            <div className='ProfileUserActions'>
                <Button clickHandler={() => history.push(`/chat?chatType=direct&id=${user.id}`) }>Message!</Button>
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