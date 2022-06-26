import React, {useEffect, useState} from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.webp';
import Image from "../Image/Image";

const Avatar = ({ clickHandler, url, alt = 'Avatar image' }) => {
    const [src, setSrc] = useState(url);
    useEffect(() => {
        setSrc(url);
    },
    [url]
    );
    return <Image url={url} className='Avatar' onClick={clickHandler}  onError={ _ => setSrc(defaultAvatar) } src={src || defaultAvatar} alt={alt} />;
}

export default Avatar;