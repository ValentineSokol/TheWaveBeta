import React from 'react';
import withTranslation from '../../reusable/withTranslation';
import Heading from "../../reusable/UIKit/Headings/Heading/Heading";
import PhotoCropper from "../../reusable/UIKit/PhotoCropper";
import {uploadFiles, updateUser} from '../../../redux/actions/api';
import {createNotification} from "../../../redux/NotificationSlice";
import Modal from "../../reusable/UIKit/Modal";
import './ChangeAvatarModal.scss';

class ChangeAvatarModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          fileSrc: ''
        };
        this.fileInputRef = React.createRef();
    }
    onClose = () => {
        this.setState({ fileSrc: '' });
        this.props.onClose();
    }

    onFileSelected = (e) => {
        const [file] = e.target.files;
        this.setState({
            fileSrc: window.URL.createObjectURL(file)
        })
    };
    onSubmit = (croppedImageBlob) => {
        this.props.createNotification('Uploading your file', 'process');
        this.props.updateUser({ files: [croppedImageBlob] });
        this.onClose();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.userUpdated && this.props.userUpdated) {
            this.props.createNotification('Your avatar has been updated!', 'success');
        }

    }

    render() {
      return(
       <Modal onClose={this.onClose} isOpen={this.props.isOpen} blockInteraction>
       <div className='ChangeAvatarModal'>
        <Heading size={2}>Change your Avatar: </Heading>
           {
               !this.state.fileSrc &&
               <input accept="image/*" onChange={this.onFileSelected} ref={this.fileInputRef} type='file'/>
           }
        <PhotoCropper onSubmit={this.onSubmit} src={this.state.fileSrc} />
       </div>
       </Modal>
      );

    }
}

const mapDispatch = { uploadFiles, updateUser, createNotification };
export default withTranslation(
    ChangeAvatarModal,
    'changeAvatarModal',
    state => ({ avatarUrl: state.global?.uploadedFiles[0], userUpdated: state.global.userUpdated }),
    mapDispatch,
    true
);
