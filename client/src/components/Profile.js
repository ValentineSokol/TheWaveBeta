import React from 'react';
import { connect } from 'react-redux';
import { loadProfile } from '../redux/actions/async';
import { CircularProgress } from '@material-ui/core';
import { faRProject } from '@fortawesome/free-brands-svg-icons';
class Profile extends React.Component {
    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.dispatch(loadProfile(id));
    }
    render() {
        const { user } = this.props;
        return ( 
         !user? <CircularProgress />
         :     
        <div>
         <h1>{user.username}</h1>   

        </div>
        );
    }
}
const mapStateToProps = (state) => ({ user: state.profile.user });
export default connect(mapStateToProps, null)(Profile); 