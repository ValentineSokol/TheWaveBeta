import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import LandingPage from'../landing/LandingPage';
import Profile from '../Profile/Profile';
import ChatWindow from '../chat/ChatWindow/index';
import Settings from '../Profile/Settings';
import QueryParser from '../QueryParser';
import RegisterForm from "../auth/RegisterForm";
import Card from "../reusable/UIKit/Cards/Card/Card";



const Routes = () => (
<Router>
    <Navbar />
    <Route path='/' component={QueryParser} />
    <Route exact path='/' component={LandingPage} />
    <Route exact path='/auth' render={props => <Card classes='RegisterPage pb-3 m-auto mt-8'><RegisterForm {...props} /></Card>} />
    <Route path='/profile/:id' component={Profile} />
    <Route path='/settings' component={Settings} />
    <Route path='/chat' component={ChatWindow} />
</Router>
);

export default Routes;