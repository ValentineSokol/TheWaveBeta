import {createSlice} from "@reduxjs/toolkit";
import {v4 as uuid} from 'uuid'

const notificationSlice = createSlice( {
    name: 'notificationSlice',
    initialState: [],
    reducers: {
        showNotification(notifications, { payload: notification }) {
           notifications.unshift(notification);
            return notifications;
        },
        startExitAnimation(notifications, { payload: notification }) {
            const index = notifications.findIndex(n => n.id === notification.id);
            notifications.splice(index, 1, {...notification, show: false});
            return notifications;
        },
        clearNotification(notifications, { payload: id }) {
            return notifications
                .filter(notification => notification.id !== id);
        }
    }
});
export const createNotification = (text, severity, lifespan = 2000) => dispatch => {
    const id = uuid();
    let notification = { id, text, severity, lifespan, show: true };
    dispatch(notificationSlice.actions.showNotification(notification));
    setTimeout(() => {
        dispatch(notificationSlice.actions.startExitAnimation(notification));
    }, lifespan);
};

export const notificationReducer = notificationSlice.reducer;
export const actions = notificationSlice.actions;