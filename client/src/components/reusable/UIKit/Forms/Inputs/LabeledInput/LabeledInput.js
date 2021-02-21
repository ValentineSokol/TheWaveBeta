import React from "react";

import './LabeledInput.scss';
import Label from "../Label/Label";

const LabeledInput = ({ label, value, placeholder, changeHandler }) => (
   <div className='LabeledInputContainer'>
    <Label label={label} />
    <input value={value} placeholder={placeholder} onChange={changeHandler} />
   </div>
);

export default LabeledInput;