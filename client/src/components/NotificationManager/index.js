import React, {Component} from "react";
import { connect } from 'react-redux';
import { createNotification, actions  } from "../../redux/NotificationSlice";
import Notification from "./Notification";

import './NotificationManager.scss';


class NotificationManager extends Component {
    render() {
        return <div className='NotificationManager'>
            {
                this.props.notifications.map(notification => (
                    <Notification key={notification.id} soundEnabled={this.props.soundEnabled} clearNotification={this.props.clearNotification} notification={notification}/>
               )

                    )
            }
        </div>;
    }
}
const mapState = state => ({ notifications: state.notifications, soundEnabled: state.preferences.notificationSound });
const mapDispatch = {
    createNotification,
    clearNotification: actions.clearNotification
};

export default connect(mapState, mapDispatch)(NotificationManager);
