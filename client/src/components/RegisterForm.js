import React, { useState } from 'react';
import {createNotification} from "../redux/NotificationSlice";
import Card from "./reusable/UIKit/Cards/Card/Card";
import '../scss/RegisterForm.css';
import { connect } from 'react-redux';
import { submitRegister } from '../redux/actions/api';
import { Link } from 'react-router-dom';
import SocialLogin from "./reusable/SocialLogin/SocialLogin";

const  RegisterForm = ({ createNotification,  submitRegister }) => {
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
        return (
              <Card headingStrings={['Welcome! We\'re so happy to see you!']}>
                <div className='RegisterFormWrapper'>
                    <form onSubmit={onSubmit}>
                        <SocialLogin />
                        <input name='username' onChange={onChange} placeholder='Username' />
                        <input name='password' onChange={onChange} type='password' placeholder='Password' />
                        <p> <Link to='/password/recover' className='PasswordReset'>Forgot your password?</Link> </p>
                        <input className='FormSubmitButton' type='submit' />   
                    </form>
                </div>
              </Card>
        );
}
export default connect(null, { createNotification, submitRegister })(RegisterForm);