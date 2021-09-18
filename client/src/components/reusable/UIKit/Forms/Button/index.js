import React from "react";
import './Button.scss';
import classNames from "classnames";

const Button = ({ children, type = 'button', transparent, className, disabled, clickHandler }) => (
        <button
                type={type}
                disabled={disabled}
                className={  classNames('Button', { 'Transparent': transparent }, { [className]: className })}
                onClick={clickHandler}
        >
                {children}
        </button>
);

export default Button;