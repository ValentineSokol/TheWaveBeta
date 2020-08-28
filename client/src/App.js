import React from 'react';
import './App.css';
import Navbar from './components/reusable/Navbar';
import LandingPage from './components/landing/LandingPage';
import RegisterForm from './components/RegisterForm';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { checkLogin } from './redux/actions/async';

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

       </Router>
     
      </div>
    )
  }
}
export default connect(null, null)(App);

