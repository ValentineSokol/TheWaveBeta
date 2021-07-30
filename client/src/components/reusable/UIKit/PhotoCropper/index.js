import React from 'react';
import ReactCropper from 'react-cropper';
import "cropperjs/dist/cropper.css";
import Button from "../Forms/Button";

export default class PhotoCropper extends React.Component {
    cropperRef = React.createRef();

    onSubmit = () => {
        const { cropper } = this.cropperRef.current;
        this.props.onSubmit(cropper.getCroppedCanvas());
    }
    render() {
       const { src } = this.props;
       return (
           <div className='PhotoCropper' style={{
               margin: '0 auto',
               width: '50%'
           }}>
               {
                   src &&
                   <ReactCropper
                       viewMode={2}
                       src={src}
                       ref={this.cropperRef}
                       initialAspectRatio={16 / 9}
                       guides={false}
                       background={false}
                       modal={false}
                       cropBoxResizable={false}
                       dragMode='move'
                       toggleDragModeOnDblclick={false}
                       data={{
                           x: 80,
                           y: 50,
                           width: 360,
                           height: 360
                       }
                       }
                   />
               }
               <Button clickHandler={this.props.onSubmit}>Upload</Button>
        </div>
       );
    }
}