import React, {useEffect, useState} from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';

const Avatar = ({ url, alt = 'Avatar image' }) => {
    const [src, setSrc] = useState(url);
    useEffect(() => {
        setSrc(url);
    },
    [url]
    );
    return <img onError={ _ => setSrc(defaultAvatar) } src={src || defaultAvatar} alt={alt} />;
}

export default Avatar;