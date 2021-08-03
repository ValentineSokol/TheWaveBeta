import React from "react";
import Avatar from "../reusable/Avatar";
import {Link} from "react-router-dom";

export default ({ name, url, avatar, lastMessageAuthor, lastMessageText}) => (
    <div className='ChatPane'>
        <Link to={url}>
            <div className='ChatPaneContent'>
                <Avatar url={avatar}  />
                <div className='ChatNameMessage'>
                        <span className='ChatName'>{name}</span>
                        <div className='LastMessageContainer'>
                        <span className='LastMessageAuthor'>{`${lastMessageAuthor}:`}</span>
                        {lastMessageText}
                        </div>
                </div>
            </div>
        </Link>
    </div>
)