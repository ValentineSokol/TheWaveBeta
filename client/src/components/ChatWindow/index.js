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
import {CSSTransition} from 'react-transition-group';
import downArrow from '../../assets/downArrow.svg';
import ContextMenu from "./Message/ContextMenu";
import Typed from "../reusable/Typed";


class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companions: [],
            messages: [],
            typers: [],
            message: '',
            loading: true,
            redirect: false,
            userScrolled: false,
            lastScrollPosition: null,
            showMessageContextMenu: false,
            messageContextMenuX: null,
            messageContextMenuY: null,

        };
    }
    hasUserScrolledToTheBottom = () => {
        const scrollPosFloat = document.scrollingElement.scrollTop + document.scrollingElement.clientHeight;
        const scrollPosInt = Math.round(scrollPosFloat);
        return document.scrollingElement.scrollHeight - scrollPosInt < 1;

        /*
            Here I determine if scrolled pixels from the top + visible pixels === max scroll height of the element
         */
    }
    handleUserScroll = () => {
        const bodyRect = document.scrollingElement.getBoundingClientRect();
        const {lastScrollPosition} = this.state;
        if (lastScrollPosition < bodyRect.top) {
            this.setState({ userScrolled: true });
        }

        if (this.hasUserScrolledToTheBottom()) {
            this.setState({ userScrolled: false });
        }
        this.setState({lastScrollPosition: bodyRect.top });
    }
    scrollToBottom = () => {
        window.focus();
        window.scrollTo(0, document.scrollingElement.scrollHeight, { behavior: 'smooth' });
    }
    isDirectChat = () => this.props.match.params.chatType === 'direct'
    onMessageReceived = message => {
        if (this.state.chatroom.id !== message.chatId) return;
        const { messages } = this.state;
        const messageWithAnimationData = { ...message, shouldPlayEnterAnimation: true };
        this.setState({ messages: [...messages, messageWithAnimationData ]});
    }
    onCompanionTypingChange = ({ username, isDirect, chatId}) => {
        if (Number(chatId) !==this.props.user?.id) return;
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
        const wrapInHtml = message => <div className='TypingMessage'>{message}<Typed strings='...' showCursor={false} /></div>;
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
    closeContextMenu = (e) => {
        this.setState({ showMessageContextMenu: false });
    }
    async componentDidMount() {
        window.addEventListener('click', this.closeContextMenu);
        window.addEventListener('scroll', this.handleUserScroll);
        this.props.setNavbarVisibility(false);
            const chatroomId = this.isDirectChat() ?
                await fetcher(`/chat/findDirectChatroom/${this.props.match.params.id}`,'PUT')
                :
                this.props.match.params.id;
            const chatroom = await fetcher(`/chat/getChatroom/${chatroomId}`);
            const companions = chatroom?.Users ?? [];
        if (this.props.isWsOpen) {
            this.onWsOpen();
        }
        this.setState({ companions, chatroom, messages: chatroom ? chatroom.messages : [] });
    }
    renderMessages = () => {
        const {messages} = this.state;
        if (!messages) return [];
        const result = [];
        const renderNewMessage = (message, isJoint, displayUsername) => {
            result.push(
                <Message
                    key={message.id}
                    message={message}
                    user={this.props.user}
                    companions={this.state.companions}
                    isJoint={isJoint}
                    displayUsername={displayUsername}
                    onContextMenu={this.onContextMenu}
                    shouldPlayEnterAnimation={message.shouldPlayEnterAnimation}
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

  async  componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.user && this.props.user) {
        }
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
        if (this.state.messages !== prevState.messages && !this.state.userScrolled) {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeContextMenu);
        window.removeEventListener('scroll', this.handleUserScroll);
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
        if (this.state.editingMessage) {
            if (!this.state.message) return;
            this.setState({ message: '' });
            await fetcher(
                `/chat/editDirectMessage/${this.state.selectedMessage.id}`,
                'PATCH',
                { newText: this.state.message }
            );
            return;
        }
        const messageObj = {
            text: this.state.message.trim(),
            from: this.props.user.id,
            shouldPlayEnterAnimation: true
        };
        const isMessageEmpty = !this.state.message.trim();
        this.setState({
           // messages: [...this.state.messages, messageObj],
            message: '',
            isTyping: false
        });
        if (isMessageEmpty) return;
        try {
            await fetcher(
                `/chat/sendMessage/${this.state.chatroom.id}`,
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
    onContextMenu = (pageX, pageY, target) => {
        console.log(target);
        this.setState({
            selectedMessage: { id: target.dataset.id, text: target.dataset.text },
            showMessageContextMenu: true,
            messageContextMenuX: pageX,
            messageContextMenuY: pageY,
        });
    }
    editMessage = (e) => {
        const { text, id } = this.state.selectedMessage;
        this.setState({ message: text, editingMessage: true });

    };
    deleteMessage = (e) => {

    };
    render() {
        const NO_CHAT_HISTORY_MESSAGE = `This is the very beginning of your chat with ${this.state?.companion?.username}`;
        const messageContextMenuActions = [
            {
                label: 'Edit',
                handler: this.editMessage
            },
            {
                label: 'Delete',
                handler: this.deleteMessage
            }
        ]
        const { isNavbarVisible } = this.props;
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        let topBadgeUrl, chatName;
        if (this.isDirectChat()) {
            const companion = this.state.companions?.find(c => Number(c.id) === Number(this.props.match.params.id));
            chatName = companion?.username;
            topBadgeUrl = companion?.avatarUrl;
        }
        else {
            chatName = this.state?.chatroom.name;
            topBadgeUrl = this.state?.chatroom.avatarUrl;
        }

        return (
            <div className='ChatWindow'>
                <ContextMenu
                    show={this.state.showMessageContextMenu}
                    left={this.state.messageContextMenuX}
                    top={this.state.messageContextMenuY}
                    actions={messageContextMenuActions}
                />
                <section style={isNavbarVisible? {} : { position: 'fixed', top: '0' }} className='TopOverlay'>
                    <span className='CompanionAvatar'>
                        <Avatar url={topBadgeUrl} />
                    </span>
                    <section className='OverlayInfo'>
                        <Heading size='1'>{chatName}</Heading>
                        {
                            this.isDirectChat() &&
                            <span>{this.state.companionOnline ? 'Online' :
                                <RelativeTime text='Last seen' timestamp={this.state.companions[0]?.lastSeen}/>}
                            </span>
                        }
                    </section>
                    <span className='NavbarToggle' onClick={this.toggleNavbar}>
                        <FontAwesomeIcon
                            icon={isNavbarVisible? navbarToggleCollapse: navbarToggleExpand}
                        />
                    </span>
                </section>
                <div className='MessageBox' >
                    {this.renderMessages()}
                    {this.renderTypingMessage()}
                </div>
                <section className='BottomSection'>
                <section className='SendMessagePanel'>
                <div className='RichArea'>
                <textarea value={this.state.message} onKeyUp={this.onKeyUp} onKeyDown={this.onEnterPress} onChange={this.typeMessage} placeholder='Write your message here' />
                <CSSTransition
                    in={this.state.message.trim()}
                    unmountOnExit
                    appear={true}
                    timeout={800}
                    classNames='scale-fade'
                >
                <FontAwesomeIcon onClick={this.sendMessage} className='SendButton' icon={faShare} />
                </CSSTransition>
                </div>
                        <CSSTransition
                            in={this.state.userScrolled}
                            unmountOnExit={true}
                            appear={true}
                            timeout={2000}
                            classNames='scale-fade'
                        >
                        <img onClick={this.scrollToBottom} src={downArrow} className='ScrollDownIcon' />
                        </CSSTransition>
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
