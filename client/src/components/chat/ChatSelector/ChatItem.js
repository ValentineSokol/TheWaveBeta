import React from "react";
import Avatar from "../../reusable/Avatar";
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedChatroomId } from '../../../redux/ChatSlice/selectors';
import { actions } from '../../../redux/ChatSlice';

export default ({ chatroom }) => {
    const selectedChatroomId = useSelector(getSelectedChatroomId);
    const loggedInUser = useSelector(state => state.global.user);
    const isActive = Number(chatroom.id) === Number(selectedChatroomId);
    const wrapperClassNames =  isActive  ? 'ChatPaneContent  ChatPaneContentActive' : 'ChatPaneContent';
    const dispatch = useDispatch();
    const selectChatroom = () => !isActive && dispatch(actions.selectChatroom(chatroom.id));
    const formatChatroomForDisplay = () => {
        const result = {
            name: chatroom.name,
            avatarUrl: chatroom.avatarUrl,
            lastMessage: chatroom.Messages[0]
        };
        const isRoomDirect = chatroom.directChatroomHash;
        if (!isRoomDirect) return result;
        const [companion] = chatroom.members;
        if (!companion) {
            result.name = loggedInUser.username;
            result.avatarUrl = loggedInUser.avatarUrl;
            return result;
        }
        result.name = companion.username;
        result.avatarUrl = companion.avatarUrl;
        return result;
    };

    const { name, avatarUrl, lastMessage } = formatChatroomForDisplay();
    return (
        <div onClick={selectChatroom} className='ChatPane'>
            <div className={wrapperClassNames}>
                <Avatar url={avatarUrl}/>
                <div className='ChatNameMessage'>
                    <span className='ChatName'>{name}</span>
                    {
                        lastMessage &&
                        <div className='LastMessageContainer'>
                            <span className='LastMessageAuthor'>{`${lastMessage.author.username}:`}</span>
                            <p
                               aria-label={`last message. From ${lastMessage.author.username} `}
                               className='LastMessageText'
                               dangerouslySetInnerHTML={ { __html: lastMessage.text } } />
                        </div>
                    }

                </div>
            </div>
    </div>
   );
};