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
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typers: [],
            message: '',
            loading: true
        };
    }
    isDirectChat = () => this.props.match.params.chatType === 'direct'
    onMessageRecieved = message => {
        if (message.from !== this.state.companion.id || message.from === this.props.user?.id) return;
        const { messages } = this.state;
        this.setState({ messages: [...messages, message]});
    }
    onCompanionTypingChange = ({ username, isDirect, chatId}) => {
        if (chatId !== this.props.match.params.id) return;
        if (this.isDirectChat() !== isDirect) return;
        let typers = [...this.state.typers];
        if (typers.includes(username)) {
            typers = typers.filter(typer => typer !== username);
        }
        else {
            typers.push(username);
        }
        this.setState({ typers });
    }
    renderTypingMessage = () => {
        const wrapInHtml = message => <div className='TypingMessage'>{message}</div>;
        const { typers } = this.state;
        if (!typers.length) return null;
        if (typers.length === 1) {
            return wrapInHtml(`${typers[0]} is typing`);
        }
            let result = '';
            for (let i = 0; i <= 5; i += 1) {
                if (i >= typers.length) break;
                const typer = typers[i];
                result += i < 4? `${typer},` : typer;
            }
            if (typers.size > 5) {
                result += ' and others ';
            }
            result += 'are typing';
            return  wrapInHtml(result);
    }
    onWsOpen = companion => {
        WebSocketController.watchUserStatus(companion.id);
        WebSocketController.subscribe('message',this.onCompanionStatusChange, 'user-status');
        WebSocketController.subscribe('message', this.onMessageRecieved, 'message');
        WebSocketController.subscribe('message', this.onCompanionTypingChange, 'is-typing');
        WebSocketController.subscribe('message', this.onCompanionTypingChange, 'stopped-typing');
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
    renderMessages = () => {
        const {messages} = this.state;
        const result = [];
        const renderNewMessage = (message, isJoint, displayUsername) => {
            result.push(
                <Message
                    key={message.id}
                    message={message}
                    user={this.props.user}
                    companion={this.state.companion}
                    isJoint={isJoint}
                    displayUsername={displayUsername}
                />
            );
        };
        for (let i = 0; i < messages.length; i += 1) {
            const message = messages[i];
            if (i + 1 < messages.length) {
                const nextMessage = messages[i + 1];
                if (message.from === nextMessage.from) {
                    let displayUsername = false;
                    if (i === 0) {
                        displayUsername = true
                    } else {
                        const prevMessage = messages[i - 1];
                        displayUsername = prevMessage.from !== message.from;
                    }
                    renderNewMessage(message, true, displayUsername);
                } else {
                    renderNewMessage(message, false, false);
                }
            } else {
                renderNewMessage(message, false, false);
            }
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.isTyping && this.state.isTyping) {
            WebSocketController.sendTypingMessage(
                true,
                this.props.user.username,
                true,
                this.props.match.params.id
            );
        }
        if (prevState.isTyping && !this.state.isTyping) {
            WebSocketController.sendTypingMessage(
                false,
                this.props.user.username,
                true,
                this.props.match.params.id
            );
        }
    }

    componentWillUnmount() {
        this.props.setNavbarVisibility(true);
        if (this.stopTypingTimeout) clearTimeout(this.stopTypingTimeout);
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
    typeMessage = e => {
        this.setState({ message: e.target.value, isTyping: true });
        if (this.stopTypingTimeout) {
            clearTimeout(this.stopTypingTimeout);
        }
        this.setStopTypingTimeout();
   }
   setStopTypingTimeout = () => {
        this.stopTypingTimeout = setTimeout(() => {
            this.setState({ isTyping: false });
        }, 5000);
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
        const NO_CHAT_HISTORY_MESSAGE = ` This is the very beginning of your chat with ${this.state?.companion?.username}`;
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
                    {this.renderMessages()}
                    { !this.state.messages.length && <p>{NO_CHAT_HISTORY_MESSAGE}</p> }
                </div>
                <section className='BottomSection'>
                {this.renderTypingMessage()}
                <section className='SendMessagePanel'>
                <div className='RichArea'>
                <textarea value={this.state.message} onKeyUp={this.onKeyUp} onKeyDown={this.onEnterPress} onChange={this.typeMessage} placeholder='Write your message here' />
                { this.state.message.trim() && <FontAwesomeIcon onClick={this.sendMessage} className='SendButton' icon={faShare} /> }
                </div>
                </section>
                </section>
            </div>
        );
    }
}

export default  withTranslation(ChatWindow, 'chat', state => ({ isNavbarVisible: state.preferences.isNavbarVisible, user: state.global.user }), { setNavbarVisibility: preferencesAPI.setNavbarVisibility }, true)