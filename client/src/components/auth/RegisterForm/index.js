import React, { useState } from 'react';
import {createNotification} from '../../../redux/NotificationSlice';
import './RegisterForm.scss';
import { connect } from 'react-redux';
import { submitRegister } from '../../../redux/actions/api';
import SocialLogin from "../../reusable/SocialLogin/SocialLogin";
import PasswordRecoveryForm from "../PasswordRecoveryForm/PasswordRecoveryForm";
import Button from "../../reusable/UIKit/Forms/Button";
import LabeledInput from "../../reusable/UIKit/Forms/Inputs/LabeledInput";
import LinkButton from "../../reusable/UIKit/Forms/LinkButton";

const  RegisterForm = ({ createNotification,  submitRegister, queryParams: { tab } }) => {
    const TABS = {
        REGISTER: 'register',
        LOGIN: 'login',
        RECOVERY: 'recovery'
    };
    const alternativeButtons = {
        [TABS.REGISTER]: {
            text: 'Log In',
            to: '/auth?tab=login'
        },
        [TABS.LOGIN]: {
            text: 'Create a new account',
            to: '/auth?tab=register'
        },
        [TABS.RECOVERY]: {
            text: 'Create a new account',
            to: '/auth?tab=register'
        },
    };
    const [state, setState] = useState({});

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

    if (tab === TABS.RECOVERY) {
        return <PasswordRecoveryForm />;
    }
    return (
            <div className='RegisterFormWrapper'>
                <form onSubmit={onSubmit}>
                    <SocialLogin classNames='mt-2 mb-2' />
                    <div className='pl-5'>
                    <LabeledInput inputClassName='m-auto mb-2' id='usernameInput' name='username' onChange={onChange} label='Username' value={state.username} required />
                    <LabeledInput inputClassName='m-auto mb-2' id='passwordInput' name='password' onChange={onChange} label='Password' type='password' value={state.password} required />
                        { tab === TABS.REGISTER && <LabeledInput inputClassName='m-auto' id='emailInput' name='email' value={state.email} onChange={onChange} type='email' label='Email'  />}
                    </div>
                    {
                        tab === TABS.LOGIN &&
                        <div>
                            <a
                                className='RegisterForm__recovery-link mt-1 mb-1'
                                href='/auth?tab=recovery'
                            >
                                Forgot your username or password?
                            </a>
                        </div>
                    }
                            <Button type='submit' className='mt-2 mb-2'>Submit</Button>
                    { tab &&
                        <>
                            <div style={{ position: 'relative'}}>
                                <span className='TextOnTheLine'>or</span>
                            </div>
                            <div className='mt-2'><LinkButton to={alternativeButtons[tab].to}>{alternativeButtons[tab].text}</LinkButton></div>
                        </>
                    }
                        </form>
            </div>
    );
}
export default connect(state => ({ queryParams: state.global.queryParams }), { createNotification, submitRegister })(RegisterForm);