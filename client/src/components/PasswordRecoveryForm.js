import React, { useState } from 'react';
import { connect } from 'react-redux';
import { sendPasswordRecoveryCode, changePassword } from '../redux/actions/async';
import Card from "./reusable/UIKit/Cards/Card/Card";

  const PasswordRecoveryForm = ({ dispatch }) =>  {
    const [state, setState] = useState({});

    const onChange = (e) => setState({ [e.target.name]: e.target.value });
    const sendCode = (e) => {
        e.preventDefault();
        const { username } = state;
        if (!username) return;
        dispatch(sendPasswordRecoveryCode({ username }));
    } 
   const onSubmit = (e) => {
        e.preventDefault();
        const { username, recoveryCode, password } = state;
        dispatch(changePassword({ username, recoveryCode, password }));
    }
        return (
            <Card headingStrings={['Recover your password!']}>
            <div className='RegisterFormWrapper'>
                <form>
                    {!this.props.recoveryCodeSent?
                    <> 
                    <input name='username' onChange={onChange} placeholder='Username' />
                    <p><button onClick={sendCode}>Send Recovery Code</button></p>
                    </>
                    :
                    <>
                    <input name='recoveryCode' onChange={onChange} placeholder='16-symbol recovery code' />
                    <input name='password' onChange={onChange} type='password' placeholder='New Password' />
                    <input onClick={onSubmit} className='FormSubmitButton' type='submit' />
                    <input onClick={onSubmit} className='FormSubmitButton' type='submit' />
                    </>
                }   
                </form>
            </div>
            </Card>
        );
}
const mapStateToProps = (state) => ({ recoveryCodeSent: state.global.recoveryCodeSent });
export default connect(mapStateToProps, null)(PasswordRecoveryForm);