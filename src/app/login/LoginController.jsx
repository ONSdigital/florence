import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import LoginForm from './LoginForm';
import Modal from '../components/Modal';
import ChangePassword from '../components/change-password/ChangePasswordController';

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
            },
            requestPasswordChange: false
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
                case (417): {
                    this.setState({
                        requestPasswordChange: true
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

    handleInputChange(event) {
        console.log("ID:", event.target.id, "VALUE:", event.target.value);

        const id = event.target.id;
        const value = event.target.value;

        switch(id) {
            case ("email") : {
                this.setState({email: value});
                break;
            }
            case ("password") : {
                this.setState({password: value});
                break;
            }
        }



        this.setState({value: id})
    }

    render() {
        const formData = {
            inputs: [
                {
                id: "email",
                label: "Email",
                type: "email",
                onChange: this.handleInputChange,
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

                {
                    this.state.requestPasswordChange ?
                        <Modal sizeClass={"grid__col-3"}>
                            <ChangePassword/>
                        </Modal>
                        : ""
                }
            </div>
        )
    }
}

export default connect()(LoginController);