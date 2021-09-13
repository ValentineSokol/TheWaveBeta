import React from 'react';
import './Input.scss';

const Input = ({ id, onChange, value, name, required, label, type = 'text' }) => (
    <div className='LabeledInput'>
    <label className='LabeledInput__label' htmlFor={id}>
        {label} { required && <span>(required)</span>}:
        <input
            className='LabeledInput__input'
            id={id}
            onChange={onChange}
            name={name}
            value={value}
            type={type}
            required={required}
        />
    </label>
    </div>
);

export default Input;