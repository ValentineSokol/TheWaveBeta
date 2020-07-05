import React from 'react';
import './App.css';
import Navbar from './components/reusable/Navbar';
import Typed from './components/reusable/Typed';
import LandingCard from './components/landing/LandingCard';

import keepCalm from './img/landing/keepCalm.png';
import happyCommunity from './img/landing/happyCommunity.jpg';
import innovation from './img/landing/innovation.jpg';
import writersLove from './img/landing/writersLove.jpg';
export default class App extends React.Component {
  
  render() {
    return (
      <div className="App">
       <Navbar /> 
       <h1><Typed strings={
      [
        'Fanfiction. Redefined.',
        'Collaborative writing',
        'Snappy chat!',
        'Major Social-Media Support.',
        'Turn your favorite story into an audiobook!',
        'Write your story with voice alone without ever touching the keyboard!',
        'Light and easy to use interface!',
        'YouTube videos inside stories!',
        'Include your own illustrations and cover artwork for stories!',
        'Never give up and one day you will achieve something great!'
      ]
       }
       loop={true}
       /></h1>
       <h2>So, what is this all about?</h2>
       <div className='LandingCards'>
       <LandingCard 
        image={keepCalm}
        imageAlt='Keep calm and write fanfiction!'
        text={`in "The Wave" we don't let YOUR creative freedom to be strangled by a clunky UI and laggy back-end! 
               You write fanfiction — we handle the rest!`}
       />
          <LandingCard 
        image={happyCommunity}
        imageAlt='Our Community'
        text={`Our nurturing community will help new authors to really hone their skill and become better! You will make a lot of friends here!`}
       />
         <LandingCard 
        image={innovation}
        imageAlt='We bring new ideas!'
        text={`We are eager to bring new ideas to the table! Collaborative writing, Text-To-Speech and much more awaits you here!`}
       />
          <LandingCard 
        image={writersLove}
        imageAlt='Love'
        text={`Built by writers for writers! We have experienced all the painpoints of major fanfiction platforms and this project is a remedy for all of them!`}
       />
       </div>
      </div>
    )
  }

}

