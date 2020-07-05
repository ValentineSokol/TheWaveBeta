import React from 'react';
export default function LandingCard(props) {
    const {
        image,
        imageAlt,
        text,
    } = props;
    return (
        <div className='LandingCard'>
        <img src={image} alt={imageAlt} />
        <p>{text}</p>
        </div>
    )
}