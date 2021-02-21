import React from 'react';
import strings from '../../consts/Landing/TypedStrings';
import TypedHeading from "../reusable/UIKit/Headings/TypedHeading/TypedHeading";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import ItemsGrid from "../reusable/UIKit/Layout/ItemGrid/ItemGrid";
import landingCards from "../../consts/Landing/landingCards";
const LandingPage = () => {
        return (
            <div>
                <TypedHeading headingStrings={strings} loop />
                <Heading size='2'>So, what are we all about?</Heading>
                <div className='LandingCards'>
                    <ItemsGrid>
                        {landingCards}
                    </ItemsGrid>
                </div>
            </div>
        );
}

export default LandingPage;