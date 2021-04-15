import React from "react";
import Card from "../../reusable/UIKit/Cards/Card/Card";
import LabeledInput from "../../reusable/UIKit/Forms/Inputs/LabeledInput/LabeledInput";
import TextArea from "../../reusable/UIKit/Forms/Inputs/TextArea/TextArea";

import './PostStory.scss';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
  const PostStory  = () => {
        return (
            <>
            <Heading>Start writing right away!</Heading>
            <Card>
                <LabeledInput label='Chapter Name: ' />
                <TextArea label={'Chapter Text:'} />
            </Card>
            </>
        );
}
export default PostStory;