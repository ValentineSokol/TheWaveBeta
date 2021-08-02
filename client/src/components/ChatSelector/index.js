import React from 'react';
import withTranslation from '../reusable/withTranslation';
import {Link} from "react-router-dom";
import Heading from "../reusable/UIKit/Headings/Heading/Heading";
import fetcher from "../../utils/fetcher";
import './ChatSelector.scss';
import Avatar from "../reusable/Avatar";
import ItemGrid from "../reusable/UIKit/Layout/ItemGrid/ItemGrid";
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
        return (
          <div className='ChatSelector'>
              <Heading size={2}>Your chats:</Heading>
              <ItemGrid>
              {
                  this.state.chatrooms.map(room => {
                      let name = room.name;
                      let avatar = room.avatarUrl;
                      let url = `/chat/room/${room.id}`;
                      if (room.directChatroomHash && room.Users.length === 1) {
                          name = 'You';
                          avatar = this.props.user?.avatarUrl;
                          url = `/chat/direct/${this.props.user.id}`;
                      }
                      else if (room.directChatroomHash && room.Users.length === 2) {
                          const companion = room.Users.find(u => u.id !== this.props.user.id);
                          name = companion?.username;
                          avatar = companion?.avatarUrl;
                          url = `/chat/direct/${companion?.id}`;
                      }
                     return <div className='ChatPane'>
                         <Link to={url}>
                          <Avatar url={avatar}  />
                         <div>
                          <p className='ChatName'>{name}</p>
                         <p>{room.messages[0]?.text || 'no recent messages.'}</p>
                         </div>
                         </Link>
                      </div>
                  })
              }
              </ItemGrid>
          </div>
        );
    }
}

const mapState = (state) => ({user: state.global.user });
export default withTranslation(ChatSelector, 'chatSelector', mapState, null, true);