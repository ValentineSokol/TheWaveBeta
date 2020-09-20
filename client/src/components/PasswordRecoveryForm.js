import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendPasswordRecoveryCode, changePassword } from '../redux/actions/async';
import Typed from './reusable/Typed';

  class PasswordRecoveryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });
    sendCode = (e) => {
        e.preventDefault();
        const { username } = this.state;
        if (!username) return;
        this.props.dispatch(sendPasswordRecoveryCode({ username }));
    } 
    onSubmit = (e) => {
        e.preventDefault();
        const { username, recoveryCode, password } = this.state;
        this.props.dispatch(changePassword({ username, recoveryCode, password }));
    }
    render() {
        return (
            <div className='RegisterModalWrapper'>
            <h1 className='RegisterFormHeading'><Typed strings={['Recover your password:']}/></h1>
            <div className='RegisterFormWrapper'>
                <form>
                    {!this.props.recoveryCodeSent?
                    <> 
                    <input name='username' onChange={this.onChange} placeholder='Username' />
                    <p><button onClick={this.sendCode}>Send Recovery Code</button></p>
                    </>
                    :
                    <>
                    <input name='recoveryCode' onChange={this.onChange} placeholder='16-symbol recovery code' /> 
                    <input name='password' onChange={this.onChange} type='password' placeholder='New Password' />
                    <input onClick={this.onSubmit} className='FormSubmitButton' type='submit' />
                    </>
                }   
                </form>
            </div>
        </div>
        )
    }
}
const mapStateToProps = (state) => ({ recoveryCodeSent: state.global.recoveryCodeSent });
export default connect(mapStateToProps, null)(PasswordRecoveryForm);