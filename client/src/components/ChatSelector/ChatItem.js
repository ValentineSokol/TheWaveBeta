import React, {useEffect, useState} from "react";
import Avatar from "../reusable/Avatar";
import {Link} from "react-router-dom";
import {useParams} from "react-router";

export default ({ chatroomId, name, url, avatar, lastMessageAuthor, lastMessageText}) => {

    const [isActive, setIsActive] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        if (chatroomId === Number(id)) setIsActive(true);
        else setIsActive(false);
    }, [id])

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
                            <p className='LastMessageText'>{lastMessageText}</p>
                        </div>
                    }
                </div>
            </div>
        </Link>
    </div>
   );
};