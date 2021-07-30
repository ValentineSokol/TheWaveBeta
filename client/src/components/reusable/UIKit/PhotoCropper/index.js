import React from 'react';
import ReactCropper from 'react-cropper';
import "cropperjs/dist/cropper.css";
import Button from "../Forms/Button";

export default class PhotoCropper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false
        }
    }
    getCroppedImageBlob = _ => new Promise((resolve, reject) => {
           const { cropper } = this.state;
           cropper.getCroppedCanvas({ width: 360, height: 360}).toBlob(blob => resolve(blob));
    })
    onSubmit = async () => {
        this.setState({ buttonDisabled: true });
        const croppedImageBlob = await this.getCroppedImageBlob();
        this.props.onSubmit(croppedImageBlob);
    }
    onCropperInit = cropper => this.setState({ cropper })
    render() {
       const { src } = this.props;
       return (
           <div className='PhotoCropper'>
               {
                   src &&
                   <ReactCropper
                       onInitialized={this.onCropperInit}
                       viewMode={2}
                       src={src}
                       aspectRatio={1}
                       guides={false}
                       background={false}
                       modal={false}
                       responsive={true}
                       data={{
                           width: 360,
                           height: 360
                       }}
                   />
               }
               <Button disabled={!this.props.src || this.state.buttonDisabled} clickHandler={this.onSubmit}>Upload</Button>
        </div>
       );
    }
}