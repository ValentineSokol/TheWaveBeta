import React from 'react';
import './App.css';
import Navbar from './components/reusable/Navbar';
import LandingPage from './components/landing/LandingPage';
import RegisterForm from './components/RegisterForm';
import Profile from './components/Profile';
import AvatarResizer from './components/reusable/AvatarResizer';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { checkLogin } from './redux/actions/async';
import { CircularProgress } from '@material-ui/core';

class App extends React.Component {
  componentDidMount() {
   this.props.dispatch(checkLogin());
  }
  render() {
    return (
      <div className="App">
       <Router>
       <Navbar /> 
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/register' component={RegisterForm} />
        <Route path='/profile/:id' component={Profile} /> 
        <Route path='/avatar/upload' render={props => <AvatarResizer {...props} sizes={[350, 60]} />} />

       </Router>
     
      </div>
    )
  }
}
const mapStateToProps = (state) => ({ loading: state.global.loading });
export default connect(mapStateToProps, null)(App);

