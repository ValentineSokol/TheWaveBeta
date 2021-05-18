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
import { actions as preferencesAPI } from './redux/PreferencesSlice';


const App = class App extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        this.setState({ loading: true });
        const { language } = this.props;
        const translations = await import(`./consts/Locale/locale-${language}`);
        this.props.setLanguage({ newLanguage: language, newTranslations: translations.default });
        this.setState({ loading: false });
        this.props.checkLogin();

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
export default connect(mapStateToProps, { checkLogin, setLanguage: preferencesAPI.setLanguage })(App);

