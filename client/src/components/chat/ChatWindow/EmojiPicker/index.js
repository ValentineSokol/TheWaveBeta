import React from 'react';
import './EmojiPicker.scss';
import Button from "../../../reusable/UIKit/Forms/Button";
import testEmoji from '../../../../assets/testEmoji.png';


class EmojiPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }
    render() {
        return (
            <span className='EmojiPickerContainer'>
               <div className='EmojiPickerList'>
               </div>
                 <div className='EmojiPickerList'>

                 </div>
              <Button transparent><span role='img' aria-labelledby='EmojiPickerButton'>😀</span></Button>
            </span>
        )
    }
}

export default EmojiPicker;