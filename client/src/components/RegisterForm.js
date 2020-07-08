import React from 'react';
import Typed from '../components/reusable/Typed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faVk, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../css/RegisterForm.css';
export default class RegisterForm extends React.Component {
    render() {
        return (
            <div className='RegisterModalWrapper'>
                <h1 className='RegisterFormHeading'><Typed strings={['Be On The Wave!']}/></h1>
                <div className='SocialLoginWrapper'>
                    <a href='/auth/google' className='SocialLogin' id='GoogleLoginButton'> <FontAwesomeIcon icon={faGoogle} />  Login with Google</a>
                    <a href='/auth/facebook' className='SocialLogin' id='FacebookLoginButton'><FontAwesomeIcon icon={faFacebook} />  Login with Facebook</a>
                    <a href='/auth/instagram'className='SocialLogin' id='InstagramLoginButton'><FontAwesomeIcon icon={faInstagram} />  Login with Instagram</a> 
                    <a href='/auth/vk' className='SocialLogin' id='VKLoginButton'><FontAwesomeIcon icon={faVk} />  Login with VK</a> 
                </div>
                <div className='RegisterFormWrapper'>
                    <form>
                        <input placeholder='Username' /> 
                        <input type='password' placeholder='Password' />
                        <input className='FormSubmitButton' type='submit' />   
                    </form>
                </div>
            </div>
        )
    }
}