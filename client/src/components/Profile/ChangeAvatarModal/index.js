import React from 'react';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
import PhotoCropper from "../../reusable/UIKit/PhotoCropper";

export default class ChangeAvatarModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          fileSrc: ''
        };
        this.fileInputRef = React.createRef();
    }

    onFileSelected = (e) => {
        const [file] = e.target.files;
        this.setState({
            fileSrc: window.URL.createObjectURL(file)
        })
    };

    render() {
      return(
       <>
        <Heading>Change your Avatar: </Heading>
        <input onChange={this.onFileSelected} ref={this.fileInputRef} type='file'/>
           { this.state.fileSrc &&
             <PhotoCropper />
           }
       </>
      );

    }
}