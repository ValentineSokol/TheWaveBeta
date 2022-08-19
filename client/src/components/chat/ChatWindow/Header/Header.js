import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from "../../../reusable/Avatar";
import Heading from "../../../reusable/UIKit/Headings/Heading/Heading";
import { getSelectedChatroomId } from '../../../../redux/ChatSlice/selectors';
import DirectChatOnlineDisplay from "../OnlineStatusDisplay/DirectChatOnlineDisplay";

const Header = ({ avatarUrl, chatName, onlineStatusDisplay = null }) => {
    const selectedChatroomId = useSelector(getSelectedChatroomId);

    if (!selectedChatroomId) {
        return (
            <div className='ChatSelectionHeading'>
                <Heading>Your Chats:</Heading>
            </div>
        );
    }
    return (
        <>
            <Avatar url={avatarUrl} />
            <section className='OverlayInfo'>
                <Heading size='3'>{chatName}</Heading>
                <DirectChatOnlineDisplay companionId={1} />
            </section>
        </>
    );
};

export default Header;