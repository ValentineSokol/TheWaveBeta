import React from 'react';
import withTranslation from '../reusable/withTranslation';

import TypedHeading from "../reusable/UIKit/Headings/TypedHeading/TypedHeading";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import ItemsGrid from "../reusable/UIKit/Layout/ItemGrid/ItemGrid";
import ImageCard from "../reusable/UIKit/Cards/ImageCard/ImageCard";
const LandingPage = ({ translation }) => {
        return (
            <div>
                <TypedHeading headingStrings={translation?.typedStrings} loop />
                <Heading size='3'>{translation?.heading}</Heading>
                <div className='LandingCards'>
                    <ItemsGrid>
                        {translation?.cards.map((cardData, index) => <ImageCard width='50%' headingSize='3' key={index} {...cardData} />)}
                    </ItemsGrid>
                </div>
            </div>
        );
}

export default withTranslation(LandingPage, 'landing');