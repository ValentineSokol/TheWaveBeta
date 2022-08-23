import React from 'react';
import Image from "../Image/Image";

const Avatar = ({ testId, clickHandler, url, alt = 'Avatar image' }) => {
    return <Image testId={testId} url={url} className='Avatar' onClick={clickHandler} alt={alt} />;
}

export default Avatar;