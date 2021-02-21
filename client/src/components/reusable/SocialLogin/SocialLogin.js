import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faGoogle, faVk} from "@fortawesome/free-brands-svg-icons";

const SocialLogin = () => (
    <div className='SocialLoginWrapper'>
        <a href='/auth/google' className='SocialLogin' id='GoogleLoginButton'> <FontAwesomeIcon icon={faGoogle} />  Login with Google</a>
        <a href='/auth/facebook' className='SocialLogin' id='FacebookLoginButton'><FontAwesomeIcon icon={faFacebook} />  Login with Facebook</a>
        <a href='/auth/vk' className='SocialLogin' id='VKLoginButton'><FontAwesomeIcon icon={faVk} />  Login with VK</a>
    </div>
);
export default SocialLogin;