import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import landingCards from '../../../../../consts/Landing/landingCards';
import ImageCard from "./ImageCard";

describe('creates a landing card', () => {
   let container, getById;
   beforeEach(() => {
      container = document.createElement('div');
      const { getByTestId } = render(<ImageCard {...props} />, container);
      getById = getByTestId;
   })
   const props = landingCards[0];
  it('renders and unmounts correctly', () => {
     const div = document.createElement('div');
     ReactDOM.render(<ImageCard {...props} />, div);
     ReactDOM.unmountComponentAtNode(div);
  })
  it('shows the paragraph text correctly', () => {
     expect(getById('text-content')).toHaveTextContent(props.text);
  });

  it('image has the correct source', () => {
     expect(getById('image')).toHaveAttribute('src', props.image);
  })

  it('image has the correct alt', () => {
      expect(getById('image')).toHaveAttribute('alt', props.imageAlt);
  })

});