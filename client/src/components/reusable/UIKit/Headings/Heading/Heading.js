import React from "react";
import './Heading.scss';

const Heading = ({ children, size }) => {
    const HeadingTag = `h${size}`;
    return <HeadingTag className='Heading'>{children}</HeadingTag>

};
Heading.defaultProps = {
    size: '1'
}

export default Heading;