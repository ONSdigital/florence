import React, { Component } from 'react';
import { connect } from 'react-redux'

import { get } from '../utilities/get'
import { post } from '../utilities/post'

import { userLoggedIn } from '../config/actions';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

    }

    setUserState(response) {
        const email = response.email;
        let userType = '';
        if (response.editor) {
            userType = 'EDITOR'
        } else {
            userType = 'DATA-VIS'
        }
        const isAdmin = !!response.admin;
        this.props.dispatch(userLoggedIn(email, userType, isAdmin));
    }

    setAccessTokenCookie(accessToken) {
        document.cookie = "access_token=" + accessToken + ";path=/";
    }

    getUserType(email) {
        get(`/zebedee/permission?email=${email}`)
            .then(userTypeResponse => {
                this.setUserState(userTypeResponse);
            }).catch(error => {
                console.log(error);
                return error;
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const postBody = {
            email: this.state.email,
            password: this.state.password
        };

        post('/zebedee/login', postBody)
            .then(accessToken => {
                this.setAccessTokenCookie(accessToken);
                this.getUserType(this.state.email)
            }).catch(error => {
                console.log(error);
                return error;
            });
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div className="col--4 login-wrapper">
                <h1>Login</h1>

                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" className="fl-user-and-access__email" name="email" cols="40" rows="1" onChange={this.handleEmailChange}/>

                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" className="fl-user-and-access__password" name="password" cols="40" rows="1" onChange={this.handlePasswordChange}/>

                    <button type="submit" id="login" className="btn btn--primary margin-left--0 btn-florence-login fl-panel--user-and-access__login ">Log in</button>
                </form>
            </div>
        )
    }
}

export default connect()(Login);