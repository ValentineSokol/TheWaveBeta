import React from 'react';
import { connect } from 'react-redux';
import { Slider, CircularProgress } from '@material-ui/core';
import DropZone from 'react-drop-zone';
import { uploadFiles, updateUser } from '../../redux/actions/async';
import '../../css/AvatarResizer.css';
 class AvatarResizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { widthSelector: 0.5, width: 0.1, x:0, y:0, canDraw: false };
    }
    getBlob = () => new Promise((resolve, reject) => {
        this.state.canvas.toBlob((blob) => resolve(blob),'image/png', 1);
    });
    onSubmit = async (e) => {
        e.preventDefault();
        const urls = {};
        const { sizes } = this.props;
        if (!Array.isArray(sizes) || !sizes.length) return;
      //  this.setState({ loading: true });
        const files = [];
        for (const width of sizes) {
            const imageX = this.state.x * this.state.imageNaturalWidth / this.state.imageElementWidth;
            const imageY = this.state.y * this.state.imageNaturalHeight / this.state.imageElementWidth;
            this.drawAvatar(imageX, imageY, width);
            const blob = await this.getBlob();
            files.push(blob);    
        }
        console.log(files);
        await this.props.dispatch(uploadFiles( { files }));
        const avatarUrl = this.props.files && this.props.files[0];
        if (!avatarUrl) return;
        await this.props.dispatch(updateUser({ avatarUrl }))

    }
    componentDidMount() {
        this.refs.image.onload = () => this.setState({
             canDraw: true,
             canvas: this.refs.canvas,
             image: this.refs.image,
             widthSelector: 0.5,
             width: 0.5 * this.refs.image.width,
             imageElementWidth: this.refs.image.width,
             imageElementHeight: this.refs.image.height,
             imageNaturalWidth: this.refs.image.naturalWidth,
             imageNaturalHeight: this.refs.image.naturalHeight,
        });
        this.refs.image.onmousedown = (e) => {
            this.setState({ x: e.offsetX, y: e.offsetY });
        } 
    }
    onFileChange = (file) => {
        console.log(file);
        this.setState({ filename: file.name, blob: window.URL.createObjectURL(file)  });
        this.setState({ canDraw: false });
    }
    OnWidthChange = (e, width) => {
        this.setState({ widthSelector: width, width: width * this.refs.image.width });
    }
    drawAvatar = (sx, sy, resultWidth) => {
       const width = this.state.width * this.state.imageNaturalWidth / this.state.imageElementWidth;
       const ctx = this.state.canvas.getContext('2d');
       ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
       this.state.canvas.width = resultWidth;
       this.state.canvas.height = resultWidth;
       ctx.drawImage(this.state.image, sx, sy, width, width, 0, 0, resultWidth, resultWidth); 
    }
    render() {
        return (
            this.state.loading? <CircularProgress />
            :
            <div className='AvatarContainer'>
                {
                  !this.props.blob &&  
                 <DropZone onDrop={this.onFileChange} accept="image/*">
                    {() => (
                      <section>
                        <div className='card'>
                          <input value={this.state.filename} />
                          <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                      </section>
  )}
                   </DropZone>
                }  
                   <div className='Draggable' ref='draggable'>
                 <span className='Dragger' style={
                            {
                                width: this.state.width,
                                height: this.state.width,
                                position: 'absolute',
                                left: this.state.x,
                                top: this.state.y,
                                display: this.state.blob || this.props.blob? 'block' : 'none'
                            }
                    }
                 ref='dragger'                 
                 />
                     <img ref='image' alt='imageToResize' className='imageToResize' src={this.state.blob || this.props.blob}/>
                </div>   
         <canvas className='AvatarResultCanvas'  ref='canvas'/> 
         <div className='WidthSliderContainer'>   
            <Slider
                value={this.state.widthSelector}
                onChange={this.OnWidthChange}
                min={0.1}
                max={1}
                step={0.01}
                aria-labelledby="input-slider"
          />
          <button onClick={this.onSubmit}>Upload</button>    
          </div> 
            </div>    
        );
    }
}
const mapStateToProps = (state) => ({ files: state.global.uploadedFiles });
export default connect(mapStateToProps, null)(AvatarResizer);   