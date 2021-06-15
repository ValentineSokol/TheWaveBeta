import React from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';
const imageRef = React.createRef();
const onError = () => {
    imageRef.current.src = defaultAvatar;
}
const Avatar = ({ url = defaultAvatar, alt = 'Avatar image' }) =>  <img onError={onError} ref={imageRef} src={url} alt={alt} />

export default Avatar;