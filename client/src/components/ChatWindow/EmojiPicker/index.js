import React from 'react';


class EmojiPicker extends React.Component {
    render() {
        return (
            <div className='EmojiPickerContainer'>
              <span role='img' aria-labelledby='EmojiPickerButton'>😀</span>
            </div>
        )
    }
}

export default EmojiPicker;