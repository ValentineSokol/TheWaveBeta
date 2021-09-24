import React from 'react';
import withTranslation from '../../reusable/withTranslation';
import fetcher from "../../../utils/fetcher";
import './ChatSelector.scss';
import ChatItem from "./ChatItem";
import classNames from 'classnames';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentMedical} from '@fortawesome/free-solid-svg-icons';
import Button from "../../reusable/UIKit/Forms/Button";

class ChatSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatrooms: []
        };
    }

    async componentDidMount() {
       const chatrooms = await fetcher('/chat/chatrooms');
       this.setState({ chatrooms });
    }

    render() {
        if (!this.props.user) return null;
        return (
          <div className={classNames(
              'ChatSelector',
              { 'Expanded': !this.props.activeChatroom?.id }
          )}>
              {
                  this.state.chatrooms.map(room => {
                      let name = room.name;
                      let avatar = room.avatarUrl;
                      let chatroomId = room.id;
                      let url = `/chat/room/${room.id}`;
                      if (room.directChatroomHash && room.Users.length === 1) {
                          name = 'You';
                          avatar = this.props.user?.avatarUrl;
                          url = `/chat?chatType=direct&id=${this.props.user.id}`;
                          chatroomId = this.props?.user?.id;
                      }
                      else if (room.directChatroomHash && room.Users.length === 2) {
                          const companion = room.Users.find(u => u.id !== this.props.user.id);
                          name = companion?.username;
                          avatar = companion?.avatarUrl;
                          url = `/chat?chatType=direct&id=${companion?.id}`;
                          chatroomId = companion?.id;
                      }
                      const [lastMessage] = room.Messages;
                      const lastMessageAuthor = lastMessage && room.Users.find(u => u.id === lastMessage?.from);
                      return <ChatItem activeChatroom={this.props.activeChatroom} chatroomId={chatroomId} isDirectChatroom={!!room.directChatroomHash} name={name} avatar={avatar} url={url} lastMessageText={lastMessage?.text} lastMessageAuthor={lastMessageAuthor?.username}  />;
                  })
              }
              <Button className='CreateChatroomButton'><FontAwesomeIcon icon={faCommentMedical} /> Create chatroom</Button>
          </div>
        );
    }
}

const mapState = (state) => ({user: state.global.user });
export default withTranslation(ChatSelector, 'chatSelector', mapState, null, true);