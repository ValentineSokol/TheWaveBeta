import React from "react";

import './TextArea.scss';
import Label from "../Label/Label";
import Button from "../../Button";

const textAreaRef = React.createRef();
const test = () => textAreaRef.current.innerHtml = '<h1>Hi!</h1>';
const TextArea = ({ label, value, placeholder, rows, cols, changeHandler }) => {
  return  <div className='TextAreaContainer'>
        <Label label={label}/>
        <textarea  value={value} placeholder={placeholder} rows={rows} cols={cols} onChange={(e) => textAreaRef.current.innerHTML = e.target.value}/>
        <div ref={textAreaRef} className='output'></div>
    </div>
};

TextArea.defaultProps = {
    rows: 10,
    cols: 20
};

export default TextArea;