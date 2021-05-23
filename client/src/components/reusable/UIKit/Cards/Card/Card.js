import React from "react";

import './Card.scss';
import TypedHeading from "../../Headings/TypedHeading/TypedHeading";

const Card = ({ children, headingStrings, width, padding, classNames = '' }) => (
    <div style={{ width, padding }} className={`Card ${classNames}`}>
        { headingStrings && <TypedHeading headingStrings={headingStrings} /> }
        {children}
    </div>
)
export default Card;