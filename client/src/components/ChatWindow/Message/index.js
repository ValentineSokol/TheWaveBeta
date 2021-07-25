import React from 'react';
import Avatar from "../../reusable/Avatar";

const isOutgoingMessage = (message, userId) => message.from === userId;

const Message = ({ onContextMenu, message, companion, user, isJoint, displayUsername }) => {
    const contextMenuHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e.pageX, e.pageY, e.target);
    }
 if (!user) return null;

 return <span className={isJoint ? 'JointMessageContainer' : 'MessageContainer'}>
        {displayUsername && <h6>{isOutgoingMessage(message, user.id) ? user.username : companion.username}</h6>}
        <div className='MessageBody'>
        {
            !isJoint &&
            <Avatar url={isOutgoingMessage(message, user.id) ? user.avatarUrl : companion.avatarUrl}/>
        }
            <div className='MessageAndArrow'>
        {!isJoint &&
        <p className={isOutgoingMessage(message, user.id) ? 'right-arrow-outgoing' : 'right-arrow-incoming'}/>}
                <div className={isOutgoingMessage(message, user.id) ? 'OutgoingMessageBody' : 'IncomingMessageBody'}>
            <div data-id={message.id} data-text={message.text} onContextMenu={contextMenuHandler} className='Message'>
                <p  data-id={message.id} data-text={message.text} onContextMenu={contextMenuHandler} className='MessageText'>{message.text}</p>
            </div>
        </div>
        </div>
      </div>
    </span>
};
export default React.memo(Message);