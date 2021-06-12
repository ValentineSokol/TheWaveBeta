import React, { Component } from 'react';
import './ChatWindow.scss';
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import Card from '../reusable/UIKit/Cards/Card/Card';
import withTranslation from '../reusable/withTranslation';
import { actions as preferencesAPI } from '../../redux/PreferencesSlice';
import sendMessage from '../../assets/sendMessage.svg';
import Button from "../reusable/UIKit/Forms/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt as navbarToggleExpand, faCompressAlt as navbarToggleCollapse } from '@fortawesome/free-solid-svg-icons';
class ChatWindow extends Component {
    sendMessage = () => {
        this.setState({
            messages: [...this.state.messages, this.state.message]
        });
    };
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: ''
        };
    }

    typeMessage = e => {
        this.setState({ message: e.target.value });
   }

    toggleNavbar = () => {
        const { isNavbarVisible, setNavbarVisibility } = this.props;
        setNavbarVisibility(!isNavbarVisible);
    }
    componentDidMount() {
        this.props.setNavbarVisibility(false);
        this.inputRef = React.createRef();
    }
    render() {
        const { isNavbarVisible } = this.props;
        const url = 'https://f002.backblazeb2.com/file/theWaveFiles/Valentine-eb8ec682bebe38c31381b8a78b08a9e569a14a191a142d6a478adc5b104d94337e604011e432fea0e857760b7fb6b12914e52182eae27e91b87ba232e6b87fb1';
        return (
            <div className='ChatWindow'>
                <section style={isNavbarVisible? {} : { position: 'fixed', top: '0' }} className='TopOverlay'>
                    <section className='CompanionAvatar'>
                        <Card>
                            <img src={url} alt={'companion\'s avatar'}  />
                        </Card>
                    </section>
                    <section className='OverlayInfo'>
                        <Heading size='1'>Valentine</Heading>
                        <span>Last seen 5 min ago....</span>
                    </section>
                    <span className='NavbarToggle' onClick={this.toggleNavbar}>
                        <FontAwesomeIcon
                            icon={isNavbarVisible? navbarToggleCollapse: navbarToggleExpand}
                        />
                    </span>
                </section>
                <div className='MessageBox' >
                    {
                        this.state.messages.map(message => (
                            <span className='MessageContainer'>
                    <img src={url} alt={'companion\'s avatar'}  />
                    <p className='right-arrow' />
                    <span className='OutcomingMessage'>{message}</span>
                </span>
                        ))
                    }
                </div>
                <section id={'inputRef'}  className='SendMessagePanel'>
                <textarea onChange={this.typeMessage} placeholder='Write your message here' />
                <Button clickHandler={this.sendMessage}>
                    <img src={sendMessage} alt='Send Message Button' />
                </Button>
                </section>
            </div>
        );
    }
}

export default  withTranslation(ChatWindow, 'chat', state => ({ isNavbarVisible: state.preferences.isNavbarVisible }), { setNavbarVisibility: preferencesAPI.setNavbarVisibility }, true)