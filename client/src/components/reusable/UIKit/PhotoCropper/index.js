import React from 'react';
import ReactCropper from 'react-cropper';
import "cropperjs/dist/cropper.css";

export default class PhotoCropper extends React.Component {
    render() {
       const { src } = this.props;
       return (
           <div className='PhotoCropper'>
            <ReactCropper
                src={src}
                style={{ height: 400, width: "100%" }}
                // Cropper.js options
                initialAspectRatio={16 / 9}
                guides={false}
            />
        </div>
       );
    }
}