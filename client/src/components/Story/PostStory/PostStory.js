import React, {useState} from "react";
import Card from "../../reusable/UIKit/Cards/Card/Card";
import LabeledInput from "../../reusable/UIKit/Forms/Inputs/LabeledInput/LabeledInput";
import ExtendableContent from '../../reusable/UIKit/ExtendableContent/index';
import TextArea from "../../reusable/UIKit/Forms/Inputs/TextArea/TextArea";

import './PostStory.scss';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
import Button from "../../reusable/UIKit/Forms/Button";


  const PostStory  = () => {
      const [step, setStep] = useState(0);
      const onChapterWritten = () => {
          setStep(1);
      }
      const formStepOne =
          <>
              <Heading>Start writing right away!</Heading>
              <Card>
                  <LabeledInput label='Chapter Name: ' />
                  <TextArea label={'Chapter Text:'} />
                  <Button clickHandler={onChapterWritten}>Next</Button>
              </Card>
          </>;

      const formStepTwo =
          <>
              <Heading>Now, let's add some info about your story.</Heading>
              <Card>
                  <LabeledInput label='Story Name:' placeholder='Romeo & Juliet' />
                  <ExtendableContent label='Advanced Settings' tooltip='These are more specific fields, which would help our readers find a story to their liking. Not mandatory. '>
                    <p>I am a setting!</p>
                  </ExtendableContent>
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'center' } }>
                    <Button clickHandler={() => setStep(0)}>Back</Button>
                    <Button>Publish</Button>
                  </div>
              </Card>
          </>
      const steps = [
          formStepOne,
          formStepTwo
      ];
        return (
            <>
                {steps[step]}
            </>
        );
}
export default PostStory;