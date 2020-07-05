import React from 'react';
import Typedjs from 'typed.js';

export default class Typed extends React.Component {
    componentDidMount() {
        this.typed = new Typedjs(this.el, {
          strings: this.props.strings,
          typeSpeed: this.props.typeSpeed || 70,
          backSpeed: this.props.backSpeed || 70,
          loop: this.props.loop || false,
          loopCount: this.props.loopCount || Infinity
        });
    }
    componentWillUnmount() {
        this.typed.destroy();
    }
    render() {
        return <span ref={(el) => { this.el = el; }} className="TypedContainer"></span>
    }
}