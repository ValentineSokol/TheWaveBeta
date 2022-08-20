import React from "react";
import Avatar from "../../reusable/Avatar";
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedChatroomId } from '../../../redux/ChatSlice/selectors';
import { actions } from '../../../redux/ChatSlice';

export default ({ chatroomId, name, avatar, lastMessageAuthor, lastMessageText}) => {
    const selectedChatroomId = useSelector(getSelectedChatroomId);
    const isActive =Number(chatroomId) === Number(selectedChatroomId);
    const wrapperClassNames =  isActive  ? 'ChatPaneContent  ChatPaneContentActive' : 'ChatPaneContent';
    const dispatch = useDispatch();
    const selectChatroom = () => dispatch(actions.selectChatroom(chatroomId));
    return (
        <div onClick={selectChatroom} className='ChatPane'>
            <div className={wrapperClassNames}>
                <Avatar url={avatar}/>
                <div className='ChatNameMessage'>
                    <span className='ChatName'>{name}</span>
                    {
                        lastMessageAuthor && lastMessageText &&
                        <div className='LastMessageContainer'>
                            <span className='LastMessageAuthor'>{`${lastMessageAuthor}:`}</span>
                            <p aria-label={`last message. From ${lastMessageAuthor} `} className='LastMessageText' dangerouslySetInnerHTML={{__html: lastMessageText}} />
                        </div>
                    }
                </div>
            </div>
    </div>
   );
};