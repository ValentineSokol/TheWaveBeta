import React from 'react';
import { connect } from 'react-redux';
import { loadProfile } from '../redux/actions/async';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../css/Profile.css';
class Profile extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        const { id } = this.props.match.params;
        if (!this.props.loginChecked || (this.props.user && prevProps.match.params.id === id)) return;
        this.props.dispatch(loadProfile(id));
      
    }
    render() {
        const { user } = this.props;
        return ( 
         !user? <CircularProgress />
         :
        <div className='ProfileContainer'>     
            <div className='ProfileAvatar'>
             <img src={user.avatarUrl} alt='profile' />
             { this.props.isOwner && <Link to='/avatar/upload'>Change the Avatar</Link> }
                
            </div> 
            <div className='ProfileInfo'>
            <h1 className='ProfileUsername'>{user.username}</h1>
            <span>{user.privilege}</span>   
            </div>
        </div>
        );
    }
}
const mapStateToProps = (state) => ({ loginChecked: state.global.loginChecked,  user: state.global.loadedProfile, isOwner: state.global.ownsProfile });
export default connect(mapStateToProps, null)(Profile); 