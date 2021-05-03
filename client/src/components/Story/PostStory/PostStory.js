import React, {useState} from "react";
import Card from "../../reusable/UIKit/Cards/Card/Card";
import LabeledInput from "../../reusable/UIKit/Forms/Inputs/LabeledInput/LabeledInput";
import ExtendableContent from '../../reusable/UIKit/ExtendableContent/index';
import TextArea from "../../reusable/UIKit/Forms/Inputs/TextArea/TextArea";

import './PostStory.scss';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
import Button from "../../reusable/UIKit/Forms/Button";
import ItemGrid from "../../reusable/UIKit/Layout/ItemGrid/ItemGrid";

import storyConstants from "../../../consts/Story/storyConstants";

  const PostStory  = () => {
      const [step, setStep] = useState(0);
      const onChapterWritten = () => {
          setStep(1);
      }
      const formStepOne =
          <>
              <Heading>Start writing right away!</Heading>
              <Card>
                  <section className='StoryDetails'>
                    <LabeledInput label='Story Name:' placeholder='Romeo & Juliet' />
                  </section>
                  <section>
                    <LabeledInput label='Chapter Name: ' />
                    <TextArea label={'Chapter Text:'} />
                  </section>
                  <section className='StoryControlButtons'>
                    <Button>Publish</Button>
                    <Button clickHandler={onChapterWritten}>Advanced</Button>
                  </section>
              </Card>
          </>;

      const formStepTwo =
          <>
              <Heading>Advanced Settings.</Heading>
              <Card className='AdvancedSettingsCard'>
                  <ExtendableContent label='Cowriters' tooltip='Manage your cowriters and their permissions.'>
                      {storyConstants.COWRITER_ROLES.map(role => <p style={{ color: role.color}}>{role.name}</p>)}
                      <a href='#'>Add</a>
                  </ExtendableContent>
                  <ExtendableContent label='Maturity' tooltip='Here you can choose adult themes, depicted in your story. Our system will assign an appropriate maturity rating, based on your choices. '>
                    <ItemGrid>
                    <label>Nudity and sex</label>
                    <input type='checkbox' />
                    <label>LGBT</label>
                    <input type='checkbox' />
                    <label>Violence and gore</label>
                    <input type='checkbox' />
                    <label>Alcohol and drug use</label>
                    <input type='checkbox' />
                    <label>Depression</label>
                    <input type='checkbox' />
                    <label>Suicide</label>
                    <input type='checkbox' />
                    <label>Mental abuse</label>
                    <input type='checkbox' />
                    <label>Child abuse</label>
                    <input type='checkbox' />
                    <label>Sexual abuse</label>
                    <input type='checkbox' />
                    <label>Bad Language</label>
                    <input type='checkbox' />
                    </ItemGrid>
                  </ExtendableContent>
                  <ExtendableContent label='Fandoms' tooltip='Here you can choose, which fandom characters participate in the story and what are their relationships'>
                     <ExtendableContent label='Characters'>
                        <p>Naruto Uzumaki (Naruto)</p>
                        <p>Sasuke Uchiha (Naruto)</p>
                        <p>Sakura Haruno (Naruto)</p>
                        <p>Kakashi Hatake (Naruto)</p>
                     </ExtendableContent>

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