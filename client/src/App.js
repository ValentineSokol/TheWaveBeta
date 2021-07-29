import React from 'react';
import './App.scss';
import './scss/common/Animations.css';
import { connect } from 'react-redux';
import { checkLogin } from './redux/actions/api';
import NotificationManager from "./components/NotificationManager";
import Footer from "./components/Footer/Footer";
import { actions as preferencesAPI, loadTranslations } from './redux/PreferencesSlice';
import getBrowserLanguage from './utils/getBrowserLanguage';
import Routes from './components/Routes';
import {createNotification} from "./redux/NotificationSlice";



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
        const {wsMessage} = this.props;
        if (prevProps.wsMessage === wsMessage) return;
        if (wsMessage.type === 'message') {
            const currentHref = window.location.href.split('/').slice(3);
            const isChat = currentHref[0] === 'chat';
            const isDirectChat = currentHref[1] === 'direct';
            const chatId = currentHref[2];
            

            if (isChat && isDirectChat === wsMessage.payload.isDirect) {
                if (isDirectChat && Number(chatId) === Number(wsMessage.payload.from)) return;
                if (Number(chatId) === Number(wsMessage.payload.chatId)) return;
            }
                const message = `${wsMessage.payload.username} sent you a message.`;
                this.props.createNotification(message, 'mail');
        }
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
const mapStateToProps = (state) => ({ loading: state.global.loading,  language: state.preferences.language, wsMessage: state.WebSocket.message });
export default connect(mapStateToProps, { checkLogin, createNotification, loadTranslations, setStartLanguage: preferencesAPI.setStartLanguage })(App);

