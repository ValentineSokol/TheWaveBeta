import React, {useState} from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';

const Avatar = ({ url = defaultAvatar, alt = 'Avatar image' }) => {
    const [src, setSrc] = useState(url);
    return <img onError={() => setSrc(defaultAvatar)} src={src} alt={alt} />;
}

export default Avatar;