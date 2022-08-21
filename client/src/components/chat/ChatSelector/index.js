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
                chatrooms.map(room => <ChatItem chatroom={room} />)
            }
            <Button className='CreateChatroomButton'><FontAwesomeIcon icon={faCommentMedical} /> Create chatroom</Button>
        </div>);

};
export default ChatSelector;

