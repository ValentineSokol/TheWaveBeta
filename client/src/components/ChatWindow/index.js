import React, { Component } from 'react';
import './ChatWindow.scss';
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import withTranslation from '../reusable/withTranslation';
import { actions as preferencesAPI } from '../../redux/PreferencesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt as navbarToggleExpand, faCompressAlt as navbarToggleCollapse, faShare } from '@fortawesome/free-solid-svg-icons';
import Message from "./Message";
import fetcher from "../../utils/fetcher";
import Avatar from "../reusable/Avatar";

import WebSocketController from '../../services/webSocketController';
import RelativeTime from "../reusable/UIKit/RelativeTime";

class ChatWindow extends Component {
    async componentDidMount() {
        this.props.setNavbarVisibility(false);
        const promises = [
            fetcher(`/user/profile/${this.props.match.params.id}`),
            fetcher(`/chat/getDirectMessages/${this.props.match.params.id}`)
        ];
        const [{ user }, messages] = await Promise.all(promises);
        WebSocketController.watchUserStatus(user.id);
        WebSocketController.subscribe('user-status', this.onCompanionStatusChange);
        this.setState({ messages, companion: user });
    }
    componentWillUnmount() {
        this.props.setNavbarVisibility(true);
    }
    onCompanionStatusChange = (message) => {
      this.setState({ companionOnline: message.online, lastSeen: message.lastSeen || null });
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
            console.error(err);
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
                        <Avatar url={this.state.companion?.avatarUrl} />
                    </span>
                    <section className='OverlayInfo'>
                        <Heading size='1'>{this.state.companion?.username}</Heading>
                        <span>{ this.state.companionOnline? 'Online' : <RelativeTime text='Last seen' timestamp={this.state.lastSeen} /> }</span>
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