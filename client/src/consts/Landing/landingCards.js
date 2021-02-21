import keepCalm from "../../img/landing/keepCalm.png";
import happyCommunity from "../../img/landing/happyCommunity.jpg";
import innovation from "../../img/landing/innovation.jpg";
import writersLove from "../../img/landing/writersLove.jpg";
import ImageCard from "../../components/reusable/UIKit/Cards/ImageCard/ImageCard";
import React from "react";

const landingCards = [
    {
        image: keepCalm,
        imageAlt: 'Keep calm and write fanfiction!',
        text: 'in "The Wave" we don\'t let YOUR creative freedom to be strangled by a clunky UI and laggy back-end! You write fanfiction — we handle the rest!',
        headingStrings: 'Focus on what\'s truly important!',
    },
    {
        image: happyCommunity,
        imageAlt: 'Our Community',
        headingStrings: 'Our Community',
        text: 'Our nurturing community will help new authors to really hone their skill and become better! You will make a lot of friends here!'
    },
    {
        image: innovation,
        headingStrings: 'Time for innovation!',
        imageAlt: 'We bring new ideas!',
        text: 'We are eager to bring new ideas to the table! Collaborative writing, Text-To-Speech and much more awaits you here!'
    },
    {
        image: writersLove,
        headingStrings: 'We want you to feel at home with us!',
        imageAlt: 'Love',
        text: 'Built by writers for writers! We have experienced all the painpoints of major fanfiction platforms and this project is a remedy for all of them!'
    },
];
export default  landingCards.map((cardData, index) => <ImageCard width='50%' headingSize='3' key={index} {...cardData} />);