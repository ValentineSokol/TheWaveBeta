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
import Footer from "./components/Footer/Footer";
import { actions as preferencesAPI, loadTranslations } from './redux/PreferencesSlice';
import getBrowserLanguage from './utils/getBrowserLanguage';



const App = class App extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayLangModal: true
        };
    }
    setStartLanguage() {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) return this.props.setStartLanguage(storedLanguage);
        const inferredLanguage = getBrowserLanguage();
        this.props.setStartLanguage(inferredLanguage);
        this.setState({ displayLangModal: true });
    }
    async componentDidMount() {
        this.setStartLanguage();
        this.props.checkLogin();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.language && this.props.language) {
            this.props.loadTranslations(this.props.language);
        }
    }

    render() {
        if (this.state.loading) return 'Loading...'
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
                <Footer />
            </div>
        )
    }
}
const mapStateToProps = (state) => ({ loading: state.global.loading,  language: state.preferences.language });
export default connect(mapStateToProps, { checkLogin, loadTranslations, setStartLanguage: preferencesAPI.setStartLanguage })(App);

