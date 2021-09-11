import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import LandingPage from'../landing/LandingPage';
import Profile from '../Profile/Profile';
import PostStory from'../Story/PostStory/PostStory';
import ChatWindow from '../chat/ChatWindow';
import Settings from '../Profile/Settings';
import QueryParser from '../QueryParser';
import RegisterForm from "../auth/RegisterForm";
import Card from "../reusable/UIKit/Cards/Card/Card";



const Routes = () => (
<Router>
    <Navbar />
    <Route path='/' component={QueryParser} />
    <Route exact path='/' component={LandingPage} />
    <Route exact path='/register' render={props => <Card classes='RegisterPage'><RegisterForm {...props} /></Card>} />
    <Route path='/profile/:id' component={Profile} />
    <Route path='/settings' component={Settings} />
    <Route path='/stories/post' component={PostStory} />
    <Route path='/chat' component={ChatWindow} />
</Router>
);

export default Routes;