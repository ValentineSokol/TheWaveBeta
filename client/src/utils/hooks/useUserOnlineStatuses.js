import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendWsMessage, selectors } from "../../redux/WebSocketSlice";
import getRelativeTime from '../getRelativeTime';

export const useUserOnlineStatuses = (ids) => {
    const dispatch = useDispatch();
    const wsMessage = useSelector(selectors.getWSMessage);
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        for (const id of ids) {
            const message = { type: 'watch-user-status', payload: id };
            dispatch(sendWsMessage(message));
        }
    }, []);
    useEffect(() => {
        const userId = wsMessage?.payload?.id;
        if (wsMessage?.type !== `user-status`) return;
        if (ids.includes()) return;
        setStatuses({
            ...statuses,
            [userId]: {
                ...wsMessage?.payload,
                lastSeen: getRelativeTime(wsMessage?.payload.lastSeen)
            }
        });
    }, [wsMessage]);

    return statuses;
};

export const useUserOnlineStatus = (id) => {
    const statuses = useUserOnlineStatuses([id]);
    return statuses[id];
};