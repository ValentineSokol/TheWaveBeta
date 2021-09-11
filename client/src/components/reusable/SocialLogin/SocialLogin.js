import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faGoogle, faVk} from "@fortawesome/free-brands-svg-icons";

const SocialLogin = () => (
    <div className='SocialLoginWrapper'>
        <a href='/auth/google' className='SocialLogin' id='GoogleLoginButton'> <FontAwesomeIcon icon={faGoogle} /></a>
        <a href='/auth/facebook' className='SocialLogin' id='FacebookLoginButton'><FontAwesomeIcon icon={faFacebook} /></a>
        <a href='/auth/vk' className='SocialLogin' id='VKLoginButton'><FontAwesomeIcon icon={faVk} /></a>
    </div>
);
export default SocialLogin;