import React from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { checkLogin } from './redux/actions/api';
import NotificationManager from "./components/NotificationManager";
import Footer from "./components/Footer/Footer";
import { actions as preferencesAPI, loadTranslations } from './redux/PreferencesSlice';
import getBrowserLanguage from './utils/getBrowserLanguage';
import Routes from './components/Routes';
import WebSocketController from './services/webSocketController';

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

    render() {
        return (
            <div className="App">
                <NotificationManager />
                <Routes />
                <Footer />
            </div>
        )
    }
}
const mapStateToProps = (state) => ({ loading: state.global.loading,  language: state.preferences.language });
export default connect(mapStateToProps, { checkLogin, loadTranslations, setStartLanguage: preferencesAPI.setStartLanguage })(App);

