import React, { Component } from 'react';
import { connect } from 'react-redux'

import { post } from '../utilities/post'

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

    handleSubmit(event) {
        event.preventDefault();

        const postBody = {
            email: this.state.email,
            password: this.state.password
        };

        function setAccessTokenCookie(accessToken) {
            document.cookie = "access_token=" + accessToken+ ";path=/";
            console.log(`Cookie: access_token: ${accessToken} set`);
            // TODO update state authentication property
        }

        return post('/zebedee/login', postBody)
            .then(function(accessToken) {
                setAccessTokenCookie(accessToken);
            }).catch(function(error) {
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