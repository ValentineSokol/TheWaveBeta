import React from "react";
import './Button.scss';

const Button = ({ children, clickHandler }) => (
    <div className='ButtonContainer'>
    <button className='Button' onClick={clickHandler}>{children}</button>
    </div>
);

export default Button;