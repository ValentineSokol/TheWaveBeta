import React, { useEffect } from 'react';
import './ChatSelector.scss';
import ChatItem from "./ChatItem";
import classNames from 'classnames';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentMedical} from '@fortawesome/free-solid-svg-icons';
import Button from "../../reusable/UIKit/Forms/Button";
import { fetchUserChatrooms } from '../../../redux/actions/api/chat';
import { useDispatch, useSelector } from 'react-redux';
import {getSelectedChatroomId, getUserChatrooms} from '../../../redux/ChatSlice/selectors';

const ChatSelector = () => {
  const dispatch = useDispatch();
  const selectedChatroomId = useSelector(getSelectedChatroomId);
  const chatrooms = useSelector(getUserChatrooms);
  const user = useSelector(state => state.global.user);

  useEffect(() => {
      dispatch(fetchUserChatrooms());
  }, []);
    return (
        <div className={classNames(
            'ChatSelector',
            { 'Expanded': !selectedChatroomId }
        )}>
            {
                chatrooms.map(room => {
                    let name = room.name;
                    let avatar = room.avatarUrl;
                    let chatroomId = room.id;
                    let url = `/chat/room/${room.id}`;
                    if (room.directChatroomHash && room.Users.length === 1) {
                        name = 'You';
                        avatar = user?.avatarUrl;
                        url = `/chat?chatType=direct&id=${user.id}`;
                        chatroomId = user?.id;
                    } else if (room.directChatroomHash && room.Users.length === 2) {
                        const companion = room.Users.find(u => u.id !== user.id);
                        name = companion?.username;
                        avatar = companion?.avatarUrl;
                        url = `/chat?chatType=direct&id=${companion?.id}`;
                        chatroomId = companion?.id;
                    }
                    const [lastMessage] = room.Messages;
                    const lastMessageAuthor = lastMessage && room.Users.find(u => u.id === lastMessage?.from);
                    return (
                        <ChatItem
                            chatroomId={chatroomId}
                            name={name}
                            avatar={avatar}
                            url={url}
                            lastMessageText={lastMessage?.text}
                            lastMessageAuthor={lastMessageAuthor?.username}
                        />
                    );
                })
            }
            <Button className='CreateChatroomButton'><FontAwesomeIcon icon={faCommentMedical} /> Create chatroom</Button>
        </div>);

};
export default ChatSelector;

