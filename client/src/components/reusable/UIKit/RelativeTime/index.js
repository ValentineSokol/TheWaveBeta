import React from 'react';
import getRelativeTime from '../../../../utils/getRelativeTime';

class RelativeTime extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    updateRelativeTime = _ => this.setState({ relativeTime: getRelativeTime(this.props.timestamp) });

    componentDidMount() {
         this.updateRelativeTime();
         this.updateInterval = setInterval(
             this.updateRelativeTime,
             1000
         )
    }
    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.timestamp === this.props.timestamp) return;
        this.updateRelativeTime();
    }

    render() {
      const result = `${this.props.text || ''} ${this.state.relativeTime}`;
      return <span className='RelativeTime'> { !this.state.relativeTime? 'Peering through time...' : result }</span>
    }
}

export default RelativeTime;