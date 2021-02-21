import React from "react";

import './FlexContainer.scss';

const FlexContainer = ({ children, column }) => (
    <div style={{ flexDirection: column? 'column': 'row' }} className='FlexContainer'>{children}</div>
);
export default FlexContainer;