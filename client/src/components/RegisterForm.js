import React from 'react';
import Typed from '../components/reusable/Typed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faVk } from '@fortawesome/free-brands-svg-icons';
import '../css/RegisterForm.css';
import { connect } from 'react-redux';
import { submitRegister } from '../redux/actions/async';
import { Link } from 'react-router-dom';
class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    onSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        this.props.dispatch(submitRegister({ username, password }));
    }
    render() {
        return (
            <div className='RegisterModalWrapper'>
                <h1 className='RegisterFormHeading'><Typed strings={['Be On The Wave!']}/></h1>
                <div className='SocialLoginWrapper'>
                    <a href='/auth/google' className='SocialLogin' id='GoogleLoginButton'> <FontAwesomeIcon icon={faGoogle} />  Login with Google</a>
                    <a href='/auth/facebook' className='SocialLogin' id='FacebookLoginButton'><FontAwesomeIcon icon={faFacebook} />  Login with Facebook</a>
                    <a href='/auth/vk' className='SocialLogin' id='VKLoginButton'><FontAwesomeIcon icon={faVk} />  Login with VK</a> 
                </div>
                <div className='RegisterFormWrapper'>
                    <form onSubmit={this.onSubmit}>
                        <input name='username' onChange={this.onChange} placeholder='Username' /> 
                        <input name='password' onChange={this.onChange} type='password' placeholder='Password' />
                        <p> <Link to='/password/recover' className='PasswordReset'>Forgot your password?</Link> </p>
                        <input className='FormSubmitButton' type='submit' />   
                    </form>
                </div>
            </div>
        )
    }
}
export default connect(null, null)(RegisterForm);