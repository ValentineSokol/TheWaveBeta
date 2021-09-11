import React from "react";

import './Card.scss';
import TypedHeading from "../../Headings/TypedHeading/TypedHeading";
import classNames from "classnames";

const Card = ({ children, headingStrings, width, padding, classes = '' }) => (
    <div style={{ width, padding }} className={classNames('Card' , { [classes]: classes })}>
        { headingStrings && <TypedHeading headingStrings={headingStrings} /> }
        {children}
    </div>
)
export default Card;