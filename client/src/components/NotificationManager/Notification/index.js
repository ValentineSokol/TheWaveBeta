import React, {useEffect} from "react";
import successIcon from '../../../assets/success.svg';
import warningIcon from '../../../assets/warning.svg';
import errorIcon from '../../../assets/error.svg';
import mailIcon from '../../../assets/mail.svg';
import owlSound from '../../../assets/soundEffects/Notifications/real_owl_hoot.mp3';

import './Notification.scss';
import {CSSTransition} from "react-transition-group";

const icons = {
    success: successIcon,
    error: errorIcon,
    warning: warningIcon,
    mail: mailIcon
};

const sounds = {
    mail: owlSound
};

const Notification = ({ soundEnabled, clearNotification, notification: { id, show, lifespan, text, severity } }) => {
    useEffect(() => {
        try {
            if (!soundEnabled) return;
            const sound = sounds[severity];
            if (!sound) return;

            const soundElement = new Audio(sound);
            soundElement.play();
        }
        catch (err) {
            alert(err.message);
        }
    }, []);
    return (
        <CSSTransition
            in={show}
            appear={true}
            onExited={() => clearNotification(id) }
            timeout={lifespan}
            classNames='scale-fade'
        >
          <div className={`${severity}-notification`}>
              <img alt={`${severity}-icon.`} src={icons[severity]}/>
              <span>{text}</span>
          </div>
        </CSSTransition>
    );

};
export default React.memo(Notification);
