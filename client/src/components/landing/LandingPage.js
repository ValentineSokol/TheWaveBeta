import React from 'react';
import {connect} from 'react-redux';
import TypedHeading from "../reusable/UIKit/Headings/TypedHeading/TypedHeading";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import ItemsGrid from "../reusable/UIKit/Layout/ItemGrid/ItemGrid";
import ImageCard from "../reusable/UIKit/Cards/ImageCard/ImageCard";
const LandingPage = ({ translations }) => {
        return (
            <div>
                <TypedHeading headingStrings={translations?.typedStrings} loop />
                <Heading size='3'>{translations?.heading}</Heading>
                <div className='LandingCards'>
                    <ItemsGrid>
                        {translations?.cards.map((cardData, index) => <ImageCard width='50%' headingSize='3' key={index} {...cardData} />)}
                    </ItemsGrid>
                </div>
            </div>
        );
}

export default connect(state => ({ translations: state.preferences.translations.landing }), null)(LandingPage);