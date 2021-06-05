import React, { Component } from 'react';
import './ChatWindow.scss';
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import Card from '../reusable/UIKit/Cards/Card/Card';
import ReactQuill from "react-quill";

export default class ChatWindow extends Component {
    render() {
        const url = 'https://f002.backblazeb2.com/file/theWaveFiles/Valentine-eb8ec682bebe38c31381b8a78b08a9e569a14a191a142d6a478adc5b104d94337e604011e432fea0e857760b7fb6b12914e52182eae27e91b87ba232e6b87fb1';
        return (
          <div className='ChatWindow'>
              <section className='TopOverlay'>
                  <section className='CompanionAvatar'>
                  <Card>
                  <img src={url} alt={'companion\'s avatar'}  />
                  </Card>
                  </section>
                  <section className='OverlayInfo'>
                  <Heading size='1'>Valentine 👑</Heading>
                  <span>Last seen 5 min ago....</span>
                  </section>
              </section>
              <div className='MessageBox'>
              <span className='MessageContainer'>
                  <img src={url} alt={'companion\'s avatar'}  />
                <p className='right-arrow' />
                <span className='OutcomingMessage'>Hi, I am a chat component!</span>
              </span>
              </div>

              <ReactQuill placeholder='Write your message here...' />

          </div>
        );
    }
}
