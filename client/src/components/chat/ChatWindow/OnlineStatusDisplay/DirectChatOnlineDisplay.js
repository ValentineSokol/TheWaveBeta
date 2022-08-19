import React from 'react';
import { useUserOnlineStatus } from '../../../../utils/hooks/useUserOnlineStatuses';
import RelativeTime from "../../../reusable/UIKit/RelativeTime";

const DirectChatOnlineDisplay = ({ companionId }) => {
    const userStatus = useUserOnlineStatus(companionId);
    return (
        <span>{userStatus?.online ? 'Online' :
            <RelativeTime text='Last seen' timestamp={userStatus?.lastSeen}/>}
    </span>
    );
}

export default DirectChatOnlineDisplay;