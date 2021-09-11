import React from "react";
import ReactQuill from "react-quill";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import './RichEditor.scss';
import "quill-emoji/dist/quill-emoji.css";
import EmojiPicker from '../../../chat/ChatWindow/EmojiPicker/index';


 class RichEditor extends React.Component {
     hasText = (editor) => {
         const rawText = editor.getText();
         return rawText.replace(/\n/g, '');
     }
     onChange = (content, delta, source, editor) => {
        const message = !this.hasText(editor) ?  '' : content;
        this.props.onChange(message);
    }
     render() {
        return (
        <div className='RichEditor'>
            {
                this.props.emoji &&
                <EmojiPicker />
            }
            <ReactQuill
                onKeyDown={this.props.onKeyDown}
                onKeyUp={this.props.onKeyUp}
                className={this.props.className}
                onChange={this.onChange}
                value={this.props.value}
                modules={{ toolbar: false}}
            />
            {
                this.props.value &&
                <FontAwesomeIcon onClick={this.props.onSubmit} className='SendButton' icon={faShare}/>
            }
        </div>
        );
    }
}

export default RichEditor;