import React, { useEffect } from 'react';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/landing/LandingPage';
import RegisterForm from './components/RegisterForm';
import PasswordRecoveryForm from './components/PasswordRecoveryForm';
import Profile from './components/Profile/Profile';
import PostStory from "./components/Story/PostStory/PostStory";
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { checkLogin } from './redux/actions/api';
import NotificationManager from "./components/NotificationManager";

const App = ({ dispatch }) => {

  useEffect(
      () => dispatch(checkLogin()),
       []
  );
    return (
      <div className="App">
       <NotificationManager />
       <Router>
       <Navbar /> 
        <Route exact path='/' component={LandingPage} />
        <Route exact path='/register' component={RegisterForm} />
        <Route path='/password/recover' component={PasswordRecoveryForm} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/stories/post' component={PostStory} />
       </Router>
     
      </div>
    )
}
const mapStateToProps = (state) => ({ loading: state.global.loading });
export default connect(mapStateToProps, null)(App);

