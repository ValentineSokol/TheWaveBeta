import React from 'react';
import Card from "../reusable/UIKit/Cards/Card/Card";
import LabeledInput from "../reusable/UIKit/Forms/Inputs/LabeledInput";

class CreateStoryPage extends React.Component {
    render() {
        return (
            <div className='CreateStoryPage'>
                <Card>
                    <LabeledInput
                        label='Name'
                    />
                </Card>
            </div>
        );
    }
}

export default CreateStoryPage;
