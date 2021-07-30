import React from 'react';
import withTranslation from '../../reusable/withTranslation';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
import PhotoCropper from "../../reusable/UIKit/PhotoCropper";
import {uploadFiles} from '../../../redux/actions/api';

class ChangeAvatarModal extends React.Component {

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
    onSubmit = (croppedCanvas) => {
        console.log(croppedCanvas)
        croppedCanvas.toBlob(blob => {
            this.props.uploadFiles({ files: [blob] });
        },
            'image/webp', 1);
    }

    render() {
      return(
       <>
        <Heading>Change your Avatar: </Heading>
        <input onChange={this.onFileSelected} ref={this.fileInputRef} type='file'/>
        <PhotoCropper onSubmit={this.onSubmit} src={this.state.fileSrc} />
       </>
      );

    }
}

const mapDispatch = { uploadFiles }
export default withTranslation(
    ChangeAvatarModal,
    'changeAvatarModal',
    null,
    mapDispatch,
    true
);
