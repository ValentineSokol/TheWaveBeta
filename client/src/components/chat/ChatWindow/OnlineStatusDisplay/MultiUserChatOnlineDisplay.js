import React from 'react';
import { useUserOnlineStatuses } from '../../../../utils/hooks/useUserOnlineStatuses';

const MultiUserChatOnlineDisplay = ({ members }) => {
    const memberIds = members.map(user => user.id);
    const memberStatuses = useUserOnlineStatuses(memberIds);


};

export default DirectChatOnlineDisplay;