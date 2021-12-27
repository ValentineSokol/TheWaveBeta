import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { sendWsMessage, selectors } from "../../redux/WebSocketSlice";
import getRelativeTime from '../getRelativeTime';

const useUserStatus = (id) => {
    const wsMessage = useSelector(selectors.getWSMessage);
    const isOpen = useSelector(selectors.getWSStatus);

    const [status, setStatus] = useState({ online: false, lastSeen: null });
    const dispatch = useDispatch();

    useEffect(() => {
        if (wsMessage?.type !== `user-status-${id}`) return;
        setStatus(wsMessage?.payload);
    }, [wsMessage]);

    useEffect(() => {
        if (!isOpen) return;
        const message = { type: 'watch-user-status', payload: id };
        dispatch(sendWsMessage(message));
    }, [isOpen]);

    return { ...status, lastSeen: getRelativeTime(status.lastSeen) };
}

export default useUserStatus;