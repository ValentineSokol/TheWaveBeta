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
import RelativeTime from "../reusable/UIKit/RelativeTime";

import {sendWsMessage} from '../../redux/WebSocketSlice';
import {createNotification} from '../../redux/NotificationSlice';
import {Redirect} from 'react-router';

class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typers: [],
            message: '',
            loading: true,
            redirect: false
        };
    }
    isDirectChat = () => this.props.match.params.chatType === 'direct'
    onMessageReceived = message => {
        if (message.from !== this.state.companion.id || message.from === this.props.user?.id) return;
        const { messages } = this.state;
        this.setState({ messages: [...messages, message]});
    }
    onCompanionTypingChange = ({ username, isDirect, chatId}) => {
        if (Number(chatId) !==this.props.user.id) return;
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
                result += i < 4 ? `${typer},` : typer;
            }
            if (typers.size > 5) {
                result += ' and others ';
            }
            result += 'are typing';
            return  wrapInHtml(result);
    }
    onWsOpen = () => {
        this.props.sendWsMessage({ type: 'watch-user-status', payload: this.props.match.params.id });
        this.setState({ loading: false });
    }
    async componentDidMount() {
        this.props.setNavbarVisibility(false);
        const promises = [
            fetcher(`/user/profile/${this.props.match.params.id}`),
            fetcher(`/chat/getDirectMessages/${this.props.match.params.id}`)
        ];
        const [{ user: companion }, messages] = await Promise.all(promises);
        if (this.props.isWsOpen) {
            this.onWsOpen();
        }
        if (!companion) {
            this.setState({ redirect: true });
            this.props.createNotification('There is no such user.', 'warning');
            return;
        }
        this.setState({ messages, companion, lastSeen: companion.lastSeen });
    }
    componentDidUpdate(prevState, prevProps) {
        if (this.state.messages === prevState.messages) return;

        const messageContainer = document.querySelector('.MessageBox');
        window.scrollTo(0, messageContainer.scrollHeight);
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
                let displayUsername = false;
                if (i === 0) displayUsername = true;
                else {
                    const prevMessage = messages[i - 1];
                    displayUsername = prevMessage.from !== message.from;
                }
                if (message.from === nextMessage.from) {
                    renderNewMessage(message, true, displayUsername);
                } else {
                    renderNewMessage(message, false, displayUsername);
                }
            } else {
                const prevMessage = messages[i - 1];
                const displayUsername = prevMessage?.from !== message.from;
                renderNewMessage(message, false, displayUsername);
            }
        }
        return result;
    }

    sendTypingMessage() {
        const message = {
            type: this.state.isTyping ? 'is-typing' : 'stopped-typing',
            payload: {
                username: this.props.user.username,
                isDirect: this.isDirectChat(),
                chatId: this.props.match.params.id
            }
        };
        this.props.sendWsMessage(message);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.isWsOpen && this.props.isWsOpen) {
            this.onWsOpen();
        }
        if (prevProps.wsMessage !== this.props.wsMessage) {
            this.onWsMessage(this.props.wsMessage);
        }
        if (!prevState.isTyping && this.state.isTyping) {
            this.sendTypingMessage();
        }
        if (prevState.isTyping && !this.state.isTyping) {
            this.sendTypingMessage();
        }
    }

    componentWillUnmount() {
        this.props.setNavbarVisibility(true);
        if (this.stopTypingTimeout) clearTimeout(this.stopTypingTimeout);
    }
    onWsMessage(message) {
        if (message.type === `user-status-${this.props.match.params.id}`) {
            this.onCompanionStatusChange(message.payload);
        }
        if (message.type === 'stopped-typing' || message.type === 'is-typing') {
            this.onCompanionTypingChange(message.payload);
        }

        if (message.type === 'message') {
            this.onMessageReceived(message.payload);
        }
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
            message: '',
            isTyping: false
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
        const NO_CHAT_HISTORY_MESSAGE = `This is the very beginning of your chat with ${this.state?.companion?.username}`;
        const { isNavbarVisible } = this.props;
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        return (
            <div className='ChatWindow'>
                <section style={isNavbarVisible? {} : { position: 'fixed', top: '0' }} className='TopOverlay'>
                    <span className='CompanionAvatar'>
                        <Avatar url={this.state.companion?.avatarUrl} />
                    </span>
                    <section className='OverlayInfo'>
                        <Heading size='1'>{this.state.companion?.username}</Heading>
                        <span>{ this.state.isLoading ? 'Waiting for network...' : this.state.companionOnline? 'Online' : <RelativeTime text='Last seen' timestamp={this.state.lastSeen} /> }</span>
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

export default  withTranslation(
    ChatWindow,
    'chat',
        state => ({
            isNavbarVisible: state.preferences.isNavbarVisible,
            user: state.global.user,
            isWsOpen: state.WebSocket.isWsOpen,
            wsMessage: state.WebSocket.message
        }),
    {
        setNavbarVisibility: preferencesAPI.setNavbarVisibility,
        sendWsMessage,
        createNotification
    },
    true);
