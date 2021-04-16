import React from "react";

import ImageCard from "../../../components/reusable/UIKit/Cards/ImageCard/ImageCard";
import Heading from '../../../components/reusable/UIKit/Headings/Heading/Heading';
import landingCards from "../../../consts/Landing/landingCards";
import TypedHeading from "../../../components/reusable/UIKit/Headings/TypedHeading/TypedHeading";



describe("correctly creates a landing card.", () => {
  const [card] = landingCards;
  const component = <ImageCard {...card} />;

  it("renders a component.", () => {
    const renderedComponent = shallow(component);
    expect(renderedComponent).toBeTruthy();
  });
  it("rendered markup matches a snapshot.", () => {
    const renderedMarkup = render(component);
    expect(renderedMarkup).toMatchSnapshot();
  });
  it('Rounds the image based on a \'round\' prop.', () => {
      const findImage = () => renderedComponent.find('img');
      const roundClass = 'RoundImage';
      const renderedComponent = shallow(component);
      expect(findImage().hasClass(roundClass)).toBe(false);
      renderedComponent.setProps({ round: true });
      expect(findImage().hasClass(roundClass)).toBe(true);

  });
  it('Renders Heading, if \'headingStrings\' props is passed a single string.', () => {
      const renderedComponent = shallow(component);
      const foundHeadings = renderedComponent.find(Heading);
      expect(foundHeadings.length).toBe(1);
  });
  it('Renders Heading, if \'headingStrings\' props is passed a single string.', () => {
    const renderedComponent = shallow(component);
    renderedComponent.setProps({ headingStrings: ['a'] });
    const foundHeadings = renderedComponent.find(TypedHeading);
    expect(foundHeadings.length).toBe(1);
  });

});

