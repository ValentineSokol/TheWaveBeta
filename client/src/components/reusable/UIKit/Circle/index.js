import React from 'react';

const Circle = ({ radius, background, className }) => (
    <div className={className} style={{ width: radius, height: radius, borderRadius: '50%', background, }} />
);

export default Circle;