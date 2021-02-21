import React from "react";

import './Card.scss';
import TypedHeading from "../../Headings/TypedHeading/TypedHeading";

const Card = ({ children, headingStrings, width, padding }) => (
    <div style={{ width, padding }} className='Card'>
        { headingStrings && <TypedHeading headingStrings={headingStrings} /> }
        {children}
    </div>
)
export default Card;