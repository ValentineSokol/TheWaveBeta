import React from 'react';
import Avatar from "../../reusable/Avatar";
import {CSSTransition} from "react-transition-group";
import {Link} from "react-router-dom";

const isOutgoingMessage = (message, user) => message.from === user?.id;

const Message = ({ onContextMenu, shouldPlayEnterAnimation, message, companions, user, displaySenderInfo }) => {
    const getMessageClass = () => {
        let className;
        if (isOutgoingMessage(message, user)) {
            className = 'OutgoingMessageContainer';
        } else className = 'IncomingMessageContainer';

        if (displaySenderInfo) {
            className += ' FirstMessageInGroup';
        }
        return className;
    }
    const contextMenuHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e.pageX, e.pageY, e.target);
    };
 if (!user) return null;
 const messageAuthor = companions && companions.find(companion => companion.id === message.from);

 return (
    <CSSTransition
        in={shouldPlayEnterAnimation}
        appear={true}
        timeout={500}
        classNames='scale-fade'
    >
            <div className={getMessageClass()}>
                {
                    displaySenderInfo &&
                        <div className='SenderInfo'>
                            <Avatar url={messageAuthor?.avatarUrl}/>
                            <span className='MessageAuthorName'><Link
                                to={`/profile/${messageAuthor?.id}`}><h5>{messageAuthor?.username}</h5></Link></span>
                        </div>
                }
                <span data-id={message.id} data-text={message.text} onContextMenu={contextMenuHandler}
                      className='MessageText'>{message.text}</span>
        </div>
    </CSSTransition>
);
};
export default React.memo(Message);