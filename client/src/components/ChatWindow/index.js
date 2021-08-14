import React, { Component } from 'react';
import './ChatWindow.scss';
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import withTranslation from '../reusable/withTranslation';
import { actions as preferencesAPI } from '../../redux/PreferencesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShare,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
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
import ChatSelector from "../ChatSelector";
import toggleBodyScroll from '../../utils/toggleBodyScroll';
import EmojiPicker from "./EmojiPicker";
import classNames from 'classnames';
import {Link} from "react-router-dom";


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
        const bodyRect = document.querySelector('.MessageBox').getBoundingClientRect();
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
    isDirectChat = () => this.props.queryParams.chatType === 'direct';
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
    watchCompanionStatuses = () => {
        this.props.sendWsMessage({ type: 'watch-user-status', payload: this.props.queryParams.id });
        this.setState({ loading: false });
    }
    closeContextMenu = (e) => {
        this.setState({ showMessageContextMenu: false });
    }
    async fetchChatroom() {
        const idFromQuery = this.props.queryParams.id;
        if (!idFromQuery) return;
        const chatroomId = this.isDirectChat() ?
            await fetcher(`/chat/findDirectChatroom/${idFromQuery}`,'PUT')
            :
            idFromQuery;
        const chatroom = await fetcher(`/chat/getChatroom/${chatroomId}`);
        const companions = chatroom?.Users ?? [];
        const messages = chatroom ? chatroom.Messages : [];
        this.setState({ chatroom, companions, messages });
    }
    async componentDidMount() {
        window.addEventListener('click', this.closeContextMenu);
        window.addEventListener('scroll', this.handleUserScroll);
        toggleBodyScroll();
        if (Number.isNaN(Number(this.props?.queryParams?.id))) return;
        await this.fetchChatroom();
        if (this.props.isWsOpen) {
            this.watchCompanionStatuses();
        }
    }

    renderMessages = () => {
        const {messages} = this.state;
        if (!messages) return [];
        const result = [];
        const renderNewMessage = (message, displaySenderInfo) => {
            result.push(
                <Message
                    key={message.id}
                    message={message}
                    user={this.props.user}
                    companions={this.state.companions}
                    displaySenderInfo={displaySenderInfo}
                    onContextMenu={this.onContextMenu}
                    shouldPlayEnterAnimation={message.shouldPlayEnterAnimation}
                />
            );
        };
        for (let i = 0; i < messages.length; i += 1) {
            const message = messages[i];
            if (i === 0) {
                renderNewMessage(message, true);
                continue;
            }

            const prevMessage = messages[i - 1];
            renderNewMessage(message, prevMessage.from !== message.from);
        }
        return result;
    }

    sendTypingMessage() {
        const message = {
            type: this.state.isTyping ? 'is-typing' : 'stopped-typing',
            payload: {
                username: this.props.user.username,
                isDirect: this.isDirectChat(),
                chatId: this.props.queryParams.id
            }
        };
        this.props.sendWsMessage(message);
    }

  async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.queryParams.id !== this.props.queryParams.id || prevProps.queryParams.chatType !== this.props.queryParams.chatType) {
            if (Number.isNaN(Number(this.props?.queryParams?.id))) return;
            if (this.props.isWsOpen) {
                this.watchCompanionStatuses();
            }
            await this.fetchChatroom();
        }
        if (prevProps.queryParams.id && !this.props.queryParams.id) {
            this.setState({
                typers: [],
                messages: [],
                companions: []
            })
        }
        if (!prevProps.user && this.props.user) {
        }
        if (!prevProps.isWsOpen && this.props.isWsOpen) {
            this.watchCompanionStatuses();
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
        window.removeEventListener('click', this.closeContextMenu);
        window.removeEventListener('scroll', this.handleUserScroll);
        toggleBodyScroll();
        this.props.setNavbarVisibility(true);
        if (this.stopTypingTimeout) clearTimeout(this.stopTypingTimeout);
    }
    onWsMessage(message) {
        if (message.type === `user-status-${this.props.queryParams.id}`) {
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
            messages: [...this.state.messages, messageObj],
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
    onContextMenu = (pageX, pageY, target) => {
        console.log(target);
        this.setState({
            selectedMessage: { id: target.dataset.id, text: target.dataset.text },
            showMessageContextMenu: true,
            messageContextMenuX: pageX,
            messageContextMenuY: pageY,
        });
    }
    editMessage = () => {
        const { text } = this.state.selectedMessage;
        this.setState({ message: text, editingMessage: true });

    };

    render() {
        const messageContextMenuActions = [
            {
                label: 'Tag',
                handler: () => 1
            },
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
        return (
            <div className='ChatWindow'>
                <ContextMenu
                    show={this.state.showMessageContextMenu}
                    left={this.state.messageContextMenuX}
                    top={this.state.messageContextMenuY}
                    actions={messageContextMenuActions}
                />
                <section className='TopOverlay'>
                    <div className='TopOverlayIcons'>
                        {
                            this.props.queryParams.id &&
                            <div className='ChatSelectionIcon'>
                                <Link to='/chat'>
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                    />
                                </Link>
                            </div>
                        }
                    </div>
                    { this.getTopOverlayContent()}
                </section>
                <div className='ChatContainer'>
                    <ChatSelector activeChatroom={this.props.queryParams} />
                 <div className={classNames(
                     'ChatMainSection',
                     { 'Empty': !this.props.queryParams.id }
                 )}>
                <div className='MessageBox' >
                    {this.renderMessages()}
                    {this.renderTypingMessage()}
                </div>
                <section className='BottomSection'>
                <section className='SendMessagePanel'>
                <div className='RichArea'>
                <EmojiPicker />
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
                        <img alt='scroll to the bottom' onClick={this.scrollToBottom} src={downArrow} className='ScrollDownIcon' />
                        </CSSTransition>
                </section>
                </section>
                 </div>
            </div>
            </div>
        );
    }

    getTopOverlayContent() {
        const idFromQuery = Number(this.props.queryParams.id);
        if (Number.isNaN(idFromQuery)) {
           return (
               <div className='ChatSelectionHeading'>
                   <Heading>Your Chats:</Heading>
               </div>
           )
        }
        let topBadgeUrl, chatName;
        if (this.isDirectChat()) {
            const companion = this.state.companions?.find(c => Number(c.id) === Number(idFromQuery));
            chatName = companion?.username;
            topBadgeUrl = companion?.avatarUrl;
        }
        else {
            chatName = this.state?.chatroom?.name;
            topBadgeUrl = this.state?.chatroom?.avatarUrl;
        }
        return (
        <>
        <Avatar url={topBadgeUrl} />
        <section className='OverlayInfo'>
            <Heading size='3'>{chatName}</Heading>
            {
                this.isDirectChat() &&
                <span>{this.state.companionOnline ? 'Online' :
                    <RelativeTime text='Last seen' timestamp={this.state.companions[0]?.lastSeen}/>}
                            </span>
            }
        </section>
        </>
        );
    }
}

export default  withTranslation(
    ChatWindow,
    'chat',
        state => ({
            queryParams: state.global.queryParams,
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
