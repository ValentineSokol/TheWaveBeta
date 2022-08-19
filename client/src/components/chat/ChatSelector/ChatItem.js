import React from "react";
import Avatar from "../../reusable/Avatar";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedChatroomId } from '../../../redux/ChatSlice/selectors';

export default ({ chatroomId, name, url, avatar, lastMessageAuthor, lastMessageText}) => {
    const selectedChatroomId = useSelector(getSelectedChatroomId);
    const isActive =Number(chatroomId) === Number(selectedChatroomId);
    const wrapperClassNames =  isActive  ? 'ChatPaneContent  ChatPaneContentActive' : 'ChatPaneContent';
    return (
        <div className='ChatPane'>
        <Link to={url}>
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
        </Link>
    </div>
   );
};