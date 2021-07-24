import React from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import './index.css';
import store from './redux/reducers/store';
import App from './App';
import * as serviceWorker from './serviceWorker';
import dynamicImportPolyfill from 'dynamic-import-polyfill';

// This needs to be done before any dynamic imports are used.
dynamicImportPolyfill.initialize({
    modulePath: '/public', // Defaults to '.'
    importFunctionName: '$$import' // Defaults to '__import__'
});
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
