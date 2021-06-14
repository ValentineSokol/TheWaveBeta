import React, { Component } from 'react';
import './ChatWindow.scss';
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import withTranslation from '../reusable/withTranslation';
import { actions as preferencesAPI } from '../../redux/PreferencesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt as navbarToggleExpand, faCompressAlt as navbarToggleCollapse, faShare } from '@fortawesome/free-solid-svg-icons';
import Message from "./Message";
import fetcher from "../../utils/fetcher";
class ChatWindow extends Component {
    async componentDidMount() {
        this.props.setNavbarVisibility(false);
        const promises = [
            fetcher(`/user/profile/${this.props.match.params.id}`),
            fetcher(`/chat/getDirectMessages/${this.props.match.params.id}`)
        ];
        const [{ user }, messages] = await Promise.all(promises);
        this.setState({ messages, companion: user });
    }
    sendMessage = async () => {
        const messageObj = {
            text: this.state.message.trim(),
            sender: {
                avatarUrl: this.url,
                username: 'Valentine'
            }
        }
        const isMessageEmpty = !this.state.message.trim();
        this.setState({
            messages: isMessageEmpty ? this.state.messages : [...this.state.messages, messageObj],
            message: ''
        });
        if (isMessageEmpty) return;
        try {
            await fetcher(
                `/chat/sendDirectMessage/${this.props.match.params.id}`,
                 'PUT',
                { text: this.state.message.trim() }
            );
        }
        catch (err) {
            alert(err);
        }
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
   onEnterPress = e => {
        if (e.key === 'Shift') this.shiftPressed = true;
        if (e.key === 'Enter' && !this.shiftPressed) {
            e.preventDefault();
            this.sendMessage();
        }
   }
   onKeyUp = e => {
        if (e.key === 'Shift') this.shiftPressed = false;
   }

    toggleNavbar = () => {
        const { isNavbarVisible, setNavbarVisibility } = this.props;
        setNavbarVisibility(!isNavbarVisible);
    }
    render() {
        const { isNavbarVisible } = this.props;
        return (
            <div className='ChatWindow'>
                <section style={isNavbarVisible? {} : { position: 'fixed', top: '0' }} className='TopOverlay'>
                    <span className='CompanionAvatar'>
                            <img src={this.state.companion?.avatarUrl} alt={'companion\'s avatar'}  />
                    </span>
                    <section className='OverlayInfo'>
                        <Heading size='1'>{this.state.companion?.username}</Heading>
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
                        this.state.messages.map(message => <Message message={message} companionAvatar={this.state.companion.avatarUrl} key={message.id} />)
                    }
                </div>
                <section id={'inputRef'}  className='SendMessagePanel'>
                <div className='RichArea'>
                <textarea value={this.state.message} onKeyUp={this.onKeyUp} onKeyDown={this.onEnterPress} onChange={this.typeMessage} placeholder='Write your message here' />
                { this.state.message.trim() && <FontAwesomeIcon onClick={this.sendMessage} className='SendButton' icon={faShare} /> }
                </div>
                </section>
            </div>
        );
    }
}

export default  withTranslation(ChatWindow, 'chat', state => ({ isNavbarVisible: state.preferences.isNavbarVisible }), { setNavbarVisibility: preferencesAPI.setNavbarVisibility }, true)