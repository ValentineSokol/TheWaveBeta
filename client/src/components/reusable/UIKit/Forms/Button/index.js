import React from "react";
import './Button.scss';
import classNames from "classnames";

const Button = ({ children, transparent, className, disabled, clickHandler }) => (
    <span className='ButtonContainer'>
        <button
     disabled={disabled} className={  classNames(
            'Button',
            { 'Transparent': transparent },
            { [className]: className }
        )} onClick={clickHandler}>{children}</button>
    </span>
);

export default Button;