import React from 'react';
import Card from "../Card/Card";
import TypedHeading from "../../Headings/TypedHeading/TypedHeading";
import Heading from "../../Headings/Heading/Heading";
import './ImageCard.scss';
const ImageCard = ({ image, round, imageAlt, headingStrings, headingSize, text, width, padding }) => (
    <Card width={width} padding={padding}>
        <div className='ContentWrapper'>
         <img className={round && 'RoundImage'} src={image} alt={imageAlt} />
         <div>
             {
                 Array.isArray(headingStrings)?
                     <TypedHeading headingStrings={headingStrings} size={headingSize} />
                     :
                     <Heading size={headingSize}>{headingStrings}</Heading>
             }
            <p>{text}</p>
         </div>
        </div>
    </Card>
);

export default ImageCard;