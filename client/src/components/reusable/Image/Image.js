import React, {useEffect, useState} from 'react';
import fetcher from '../../../utils/fetcher';
import defaultImage from '../../../assets/defaultAvatar.webp';
import './Image.scss';

const Image = ({ url, alt, className, onClick, onError = () => {} }) => {
    const [imageSrc, setImageSrc] = useState(defaultImage);
    const [isNSFW, setIsNSFW] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetcher(url, { withResHeaders: true })
            .then(response => {
                setIsLoading(false);
                setImageSrc(window.URL.createObjectURL(response.payload));
                setIsNSFW(response.headers.get('nsfw-content'))
            })
        return () => window.URL.revokeObjectURL(imageSrc);
    }, []);

    const onImageClick = (e) => {
        if (!isNSFW && onClick) onClick(e);
        setIsNSFW(false);
    }

    return (
        <span onClick={onImageClick} className='Image' style={{ cursor: onClick || isNSFW ? 'pointer' : 'initial' }}>
            <img onError={onError} className={className} src={imageSrc} style={{ filter: isNSFW ? 'blur(20px)' : isLoading ? 'blur(5px)' : '' }} alt={alt} />
            {
            }
            {isNSFW &&
                <span className='Image__nsfw-warning'>
                This image has been flagged as NSFW.
                Click to view it.
            </span>
            }
        </span>
    )
};

export default Image;