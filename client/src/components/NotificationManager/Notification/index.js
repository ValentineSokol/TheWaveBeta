import React from "react";
import successIcon from '../../../assets/success.svg';
import warningIcon from '../../../assets/warning.svg';
import errorIcon from '../../../assets/error.svg';

import './Notification.scss';
import {CSSTransition} from "react-transition-group";

const Notification = ({ clearNotification, notification: { id, show, lifespan, text, severity } }) => {
    const icon = severity === 'success'? successIcon : severity === 'warning'? warningIcon : errorIcon;
    return (
        <CSSTransition
            in={show}
            appear={true}
            onExited={() => clearNotification(id) }
            timeout={lifespan} classNames='scale-fade'
        >
          <div className={`${severity}-notification`}>
              <img alt={`${severity}-icon.`} src={icon}/>
              <span>{text}</span>
          </div>
        </CSSTransition>
    );

};
export default React.memo(Notification);
