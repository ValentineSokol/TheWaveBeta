import React, { useState } from 'react';
import {createNotification} from '../../../redux/NotificationSlice';
import './RegisterForm.scss';
import { connect } from 'react-redux';
import { submitRegister } from '../../../redux/actions/api';
import SocialLogin from "../../reusable/SocialLogin/SocialLogin";
import PasswordRecoveryForm from "../PasswordRecoveryForm/PasswordRecoveryForm";
import Button from "../../reusable/UIKit/Forms/Button";
import Input from "../../reusable/UIKit/Forms/Inputs/Input";

const  RegisterForm = ({ createNotification,  submitRegister }) => {
    const [state, setState] = useState({ showRecovery: false });

    const onChange = (e) => setState({ ...state, [e.target.name]: e.target.value });
    const onSubmit = (e) => {
        e.preventDefault();
        if (!state.username) {
            createNotification(
                'Please, provide a valid username!',
                'warning'
            );
            return;
        }
        submitRegister(state);
    }
    const startRecovery = (e) => {
        setState({...state, showRecovery: true});
    };

    if (state.showRecovery) {
        return <PasswordRecoveryForm />;
    }
    return (
            <div className='RegisterFormWrapper'>
                <form onSubmit={onSubmit}>
                    <SocialLogin />
                    <Input id='usernameInput' name='username' onChange={onChange} label='Username' value={state.username} required />
                    <Input id='passwordInput' name='password' onChange={onChange} label='Password' type='password' value={state.password} required />
                    <Button clickHandler={startRecovery} className='PasswordResetButton' transparent>Forgot your password?</Button>
                    <Button className='FormSubmitButton'>Submit</Button>
                </form>
            </div>
    );
}
export default connect(null, { createNotification, submitRegister })(RegisterForm);