import React from 'react';

const Message = ({ message, companionAvatar }) => (
    <span className='MessageContainer'>
      <img src={companionAvatar} alt={'companion\'s avatar'}  />
      <p className='right-arrow' />
      <pre className='OutcomingMessage'>{message.text}</pre>
    </span>
);
export default Message;