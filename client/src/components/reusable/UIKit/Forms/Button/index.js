import React from "react";
import './Button.scss';

const Button = ({ children, disabled, clickHandler }) => (
    <div className='ButtonContainer'>
    <button disabled={disabled} className='Button' onClick={clickHandler}>{children}</button>
    </div>
);

export default Button;