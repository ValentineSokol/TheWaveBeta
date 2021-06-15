import React from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';

const Avatar = ({ url = defaultAvatar, alt = 'Avatar image' }) =>  <img src={url} alt={alt} />

export default Avatar;