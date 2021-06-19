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
    onMessageRecieved = message => {
        if (message.from !== this.state.companion.id) return;
        const { messages } = this.state;
        this.setState({ messages: [...messages, message]});
    }
    onWsOpen = companion => {
        console.info('Opened!');
        WebSocketController.watchUserStatus(companion.id);
        WebSocketController.subscribe('message',this.onCompanionStatusChange, 'user-status');
        WebSocketController.subscribe('message', this.onMessageRecieved, 'message');
        this.setState({ loading: false });
    }
    async componentDidMount() {
        this.props.setNavbarVisibility(false);
        const promises = [
            fetcher(`/user/profile/${this.props.match.params.id}`),
            fetcher(`/chat/getDirectMessages/${this.props.match.params.id}`)
        ];
        const [{ user: companion }, messages] = await Promise.all(promises);
        if (WebSocketController.isWsOpen()) {
            this.onWsOpen(companion);
        }
        else {
            WebSocketController.subscribe('open', () => this.onWsOpen(companion));
        }
        this.setState({ messages, companion, lastSeen: companion.lastSeen });
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
            from: this.props.user.id,
            to: this.state.companion.id
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
            message: '',
            loading: true
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
        if (this.state.loading) return 'Establishing connection...';
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
                        this.state.messages.map(message => <Message user={this.props.user} companion={this.state.companion} message={message} companionAvatar={this.state.companion.avatarUrl} key={message.id} />)
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

export default  withTranslation(ChatWindow, 'chat', state => ({ isNavbarVisible: state.preferences.isNavbarVisible, user: state.global.user }), { setNavbarVisibility: preferencesAPI.setNavbarVisibility }, true)