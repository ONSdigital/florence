import React, { Component } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { get } from '../utilities/get'
import { post } from '../utilities/post'

import { userLoggedIn } from '../config/actions';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: {
                inputID: "",
                message: ""
            }
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
        return get(`/zebedee/permission?email=${email}`)
            .then(userTypeResponse => {
                return userTypeResponse;
            }).catch(error => {
                console.log(`Error getting user type on login \n${error}`);
        });
    }

    postLoginCredentials(body) {
        return post('/zebedee/login', body);
    }

    handleSubmit(event) {
        event.preventDefault();

        const credentials = {
            email: this.state.email,
            password: this.state.password
        };

        this.postLoginCredentials(credentials).then(accessToken => {
            this.setAccessTokenCookie(accessToken);
            this.getUserType(this.state.email).then(userType => {
                this.setUserState(userType);
                browserHistory.push(this.props.location.query.redirect);
            });
        }).catch(error => {
            switch (error.status) {
                case (404): {
                    this.setState({
                        error: {
                            inputID: "email",
                            message: "Email address is not recognised"
                        }
                    });
                    break;
                }
                case (401): {
                    this.setState({
                        error: {
                            inputID: "password",
                            message: "Incorrect password"
                        }
                    });
                    break;
                }
            }
        });
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});

        if (this.state.error.inputID === "email") {
            this.setState({
                error: {
                    inputID: "",
                    message: ""
                }
            })
        }
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});

        if (this.state.error.inputID === "password") {
            this.setState({
                error: {
                    inputID: "",
                    message: ""
                }
            })

        }
    }

    render() {
        return (
            <div className="col col--4 col--centred">
                <h1>Login</h1>

                <form className="form" onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    {
                        this.state.error.inputID === "email" ?
                            <div className="form__error">{this.state.error.message}</div>
                            :
                            ""
                    }
                    <input id="email" type="email" className="input input__text" name="email" cols="40" rows="1" onChange={this.handleEmailChange}/>


                    <label htmlFor="password">Password:</label>
                    {
                        this.state.error.inputID === "password" ?
                            <div className="form__error">{this.state.error.message}</div>
                            :
                            ""
                    }
                    <input id="password" type="password" className="input input__text" name="password" cols="40" rows="1" onChange={this.handlePasswordChange}/>


                    <button type="submit" className="btn btn--primary margin-top--1">Log in</button>
                </form>
            </div>
        )
    }
}

export default connect()(Login);