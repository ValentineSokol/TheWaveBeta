import React from 'react';
import Avatar from "../../../reusable/Avatar";
import {CSSTransition} from "react-transition-group";
import {Link} from "react-router-dom";
import { useSelector } from 'react-redux';

const isOutgoingMessage = (message, user) => message.from === user?.id;
const Message = ({ onContextMenu, shouldPlayEnterAnimation, message, displaySenderInfo }) => {
    const user = useSelector(state => state.global.user);
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
                            <Avatar url={message.author.avatarUrl}/>
                            <span className='MessageAuthorName'><Link
                                to={`/profile/${message.author.id}`}><h5>{message.author?.username}</h5></Link></span>
                        </div>
                }
                <span
                    data-id={message.id}
                    data-text={message.text}
                    onContextMenu={contextMenuHandler}
                    className='MessageText'
                    dangerouslySetInnerHTML={{__html: message.text}}
                />
                </div>
    </CSSTransition>
);
};
export default React.memo(Message);