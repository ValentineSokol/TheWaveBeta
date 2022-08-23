import React, { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router';
import { useUserOnlineStatus } from '../../utils/hooks/useUserOnlineStatuses';
import { connect } from 'react-redux';
import { loadProfile } from '../../redux/actions/api';

import './Profile.scss';
import Card from "../reusable/UIKit/Cards/Card/Card";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import Button from "../reusable/UIKit/Forms/Button";
import Avatar from "../reusable/Avatar";
import ChangeAvatarModal from "./ChangeAvatarModal";
import Circle from "../reusable/UIKit/Circle";

const Profile = ({ dispatch, loadedUser, loggedInUser }) => {
    const { id } = useParams();
    const [isOwner, setisOwner] = useState(false);
    const [user, setUser] = useState(loggedInUser);
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const userStatus = useUserOnlineStatus(id);
    const history = useHistory();
    useEffect(() => {
        const newIsOwner = Number(id) === loggedInUser?.id;
        setisOwner(newIsOwner);
        if (newIsOwner) setUser(loggedInUser);
    }, [loggedInUser])
    useEffect(
        () => {
            if (!id || user?.id === Number(id)) return;
            dispatch(loadProfile(id));
            if (!user) setUser(loadedUser);
        },
        [id, loadedUser]
    );

    useEffect(
        () => {
            if (isOwner) setUser(loggedInUser)
        }, [loggedInUser]);
        return (
         !user? null
         :
        <div className='ProfileContainer'>
           <ChangeAvatarModal onClose={_ => setIsChangingAvatar(false)} isOpen={isChangingAvatar} />
           <section>
           <Card classes='AvatarCard'>
            <div className='ProfileAvatar'>
                <Avatar testId='ProfileAvatar' clickHandler={() => isOwner && setIsChangingAvatar(true)} url={user.avatarUrl} />
            </div>
           </Card>
            <div className='ProfileUserActions'>
                <Button className='mr-1' clickHandler={() => history.push(`/chat?chatType=direct&id=${user.id}`) }>Message!</Button>
            </div>
           </section>
            <div className='ProfileInfo'>
                <div className='Username'>
                <Heading size='2'>{user.username}</Heading>
                { userStatus?.online && <Circle className='ml-1' radius='15px' background="green" /> }
                    { !userStatus?.online && <div className='ml-1'>{userStatus?.lastSeen} </div>}
                </div>
                <span>{user.privilege}</span>
            </div>
        </div>
      );
}
const mapStateToProps = (state) => ({ loginChecked: state.global.loginChecked,  loadedUser: state.global.loadedUser, loggedInUser: state.global.user });
export default connect(mapStateToProps, null)(Profile); 