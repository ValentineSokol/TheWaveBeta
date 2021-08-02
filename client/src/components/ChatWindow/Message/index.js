import React, {useEffect} from 'react';
import Avatar from "../../reusable/Avatar";
import {CSSTransition} from "react-transition-group";

const isOutgoingMessage = (message, userId) => message.from === userId;

const Message = ({ onContextMenu, shouldPlayEnterAnimation, message, companions, user, isJoint, displayUsername }) => {
    const contextMenuHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e.pageX, e.pageY, e.target);
    };
 if (!user) return null;
 const messageRef = React.createRef();
 const messageAuthor = companions && companions.find(companion => companion.id === message.from);

 return (
    <CSSTransition
        in={shouldPlayEnterAnimation}
        appear={true}
        timeout={500}
        classNames='scale-fade'
    >
    <span ref={messageRef} className={isJoint ? 'JointMessageContainer' : 'MessageContainer'}>
        {displayUsername && <h6>{messageAuthor?.username}</h6>}
        <div className='MessageBody'>
        {
            !isJoint &&
            <Avatar url={messageAuthor?.avatarUrl}/>
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
    </CSSTransition>
);
};
export default React.memo(Message);