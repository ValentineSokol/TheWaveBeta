import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import rootReducer from './redux/reducers/root';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
const store = configureStore({
   reducer: rootReducer,
  // middleware: [logger] 
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
serviceWorker.unregister();
