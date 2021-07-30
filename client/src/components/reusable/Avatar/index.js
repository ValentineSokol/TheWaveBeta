import React, {useEffect, useState} from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';

const Avatar = ({ clickHandler, url, alt = 'Avatar image' }) => {
    const [src, setSrc] = useState(url);
    useEffect(() => {
        setSrc(url);
    },
    [url]
    );
    return <img className='Avatar' style={{ cursor: clickHandler ? 'pointer' : 'auto'}} onClick={clickHandler} className='Avatar' onError={ _ => setSrc(defaultAvatar) } src={src || defaultAvatar} alt={alt} />;
}

export default Avatar;