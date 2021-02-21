import React, {useState} from 'react';

const Carousel = ({ items }) => {
    const [index, setIndex] = useState(0);
    const incrementIndex = () => {
        if (index + 1 >= items.length) return;
        setIndex(index + 1);
    }
    const decrementIndex = () => {
        if (index - 1 < 0) return;
        setIndex(index - 1);
    }
  return (
    <div className="CarouselContainer">
        {items[index]}
        <div className='CarouselButtons'>
            <button disabled={index - 1 < 0} onClick={decrementIndex}>Back</button>
            <button disabled={index + 1 >= items.length} onClick={incrementIndex}>Next</button>
        </div>
    </div>
  );
};
export default Carousel;
