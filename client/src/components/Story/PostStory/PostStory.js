import React from "react";
import Card from "../../reusable/UIKit/Cards/Card/Card";
import TypedHeading from "../../reusable/UIKit/Headings/TypedHeading/TypedHeading";
import LabeledInput from "../../reusable/UIKit/Forms/Inputs/LabeledInput/LabeledInput";
import TextArea from "../../reusable/UIKit/Forms/Inputs/TextArea/TextArea";
import Carousel from "../../reusable/UIKit/Carousel/Carousel";

import './PostStory.scss';
  const PostStory  = () => {
        const item1 = <Card padding='1%'>
            <TypedHeading headingStrings={['Main Details'] } />
             <LabeledInput label={'Name:'} placeholder='Your Story Name' />
             <TextArea label={'Description:'} placeholder='Your story description' />
        </Card>;
        const item2 = <Card>Valentine</Card>;
        const items = [item1, item2];
        return (
           <Carousel items={items}/>
        );
}
export default PostStory;