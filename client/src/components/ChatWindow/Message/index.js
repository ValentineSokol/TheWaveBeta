import React from 'react';
import Avatar from "../../reusable/Avatar";

const isOutgoingMessage = (message, userId) => message.from === userId;

const Message = ({ message, companion, user }) => (
    <span className='MessageContainer'>
      <div className='MessageBody'>
        <Avatar url={ isOutgoingMessage(message, user.id)? user.avatarUrl : companion.avatarUrl} />
        <div>
        <div className='MessageText'>
            <p className='right-arrow' />
            <div className='OutcomingMessage'>
                 <h6>{isOutgoingMessage(message, user.id)? user.username : companion.username}</h6>
                <pre>{message.text}</pre>
            </div>
        </div>
        </div>
      </div>
    </span>
);
export default Message;