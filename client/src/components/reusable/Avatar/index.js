import React from 'react';
import Image from "../Image/Image";

const Avatar = ({ clickHandler, url, alt = 'Avatar image' }) => {
    return <Image url={url} className='Avatar' onClick={clickHandler} alt={alt} />;
}

export default Avatar;