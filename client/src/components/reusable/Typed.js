import React, { useEffect, useRef } from 'react';
import TypedJs from 'typed.js';

const Typed = ({ strings, typeSpeed = 70, backSpeed = 70, loop, loopCount = Infinity}) => {
    const typedContainerRef = useRef(null);
    useEffect(
        () => {
            const typed = new TypedJs(typedContainerRef.current, {
                strings,
                typeSpeed,
                backSpeed,
                loop,
                loopCount
            });
           return () => typed.destroy();
        },
        [strings, typeSpeed, backSpeed, loop, loopCount]
    );
        return <span ref={typedContainerRef} className="TypedContainer" />;
}

export default Typed;