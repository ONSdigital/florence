import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import LoginForm from './LoginForm';

import { get } from '../utilities/get';
import { post } from '../utilities/post';
import { redirectToOldFlorence } from '../utilities/redirectToOldFlorence';
import cookies from '../utilities/cookies';

import { userLoggedIn } from '../config/actions';

class LoginController extends Component {
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
            cookies.add("access_token", accessToken);
            this.getUserType(this.state.email).then(userType => {
                this.setUserState(userType);
                // browserHistory.push(this.props.location.query.redirect);
                redirectToOldFlorence();
            });
        }).catch(error => {
            switch (error.status) {
                case (404): {
                    this.setState({
                        error: {
                            inputID: "email",
                            message: "Email address not recognised"
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

        if (this.state.error.inputID === "email")  {
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
        const formData = {
            inputs: [
                {
                id: "email",
                label: "Email",
                type: "email",
                onChange: this.handleEmailChange,
            },{
                id: "password",
                label: "Password",
                type: "password",
                onChange: this.handlePasswordChange,
                }
            ],
            error: this.state.error,
            onSubmit: this.handleSubmit
        };

        return (
            <div>
                <LoginForm formData={formData} />
            </div>
        )
    }
}

export default connect()(LoginController);