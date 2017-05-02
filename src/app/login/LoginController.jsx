import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';
// import Modal from '../components/Modal';
// import ChangePasswordController from '../components/change-password/ChangePasswordController';

import { get } from '../utilities/get';
import { post } from '../utilities/post';
import { redirectToOldFlorence } from '../utilities/redirectToOldFlorence';
import cookies from '../utilities/cookies';

import { userLoggedIn } from '../config/actions';

LoginController.propTypes = {
    dispatch: PropTypes.func.isRequired
}

class LoginController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: {
                value: "",
                errorMsg: ""
            },
            password: {
                value: "",
                errorMsg: ""
            },
            requestPasswordChange: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChangeCancel = this.handlePasswordChangeCancel.bind(this);
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
            email: this.state.email.value,
            password: this.state.password.value
        };

        this.postLoginCredentials(credentials).then(accessToken => {
            cookies.add("access_token", accessToken);
            this.getUserType(this.state.email.value).then(userType => {
                this.setUserState(userType);
                // browserHistory.push(this.props.location.query.redirect);
                redirectToOldFlorence();
            });
        }).catch(error => {
            switch (error.status) {
                case (404): {
                    const email = Object.assign({}, this.state.email, {errorMsg: "Email address not recognised"});
                    this.setState({
                        email: email
                    });
                    break;
                }
                case (401): {
                    const password = Object.assign({}, this.state.email, {errorMsg: "Incorrect password"});
                    this.setState({
                        password: password
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

    handleInputChange(event) {
        const id = event.target.id;
        const value = event.target.value;

        switch(id) {
            case ("email") : {
                this.setState({
                    email: {
                        value: value,
                        errorMsg: ""
                    }
                });
                break;
            }
            case ("password") : {
                this.setState({
                    password: {
                        value: value,
                        errorMsg: ""
                    }
                });
                break;
            }
        }
    }

    handlePasswordChangeCancel(event) {
        event.preventDefault();

        this.setState({
            requestPasswordChange: false
        });

    }

    render() {
        const formData = {
            inputs: [
                {
                    id: "email",
                    label: "Email",
                    type: "email",
                    onChange: this.handleInputChange,
                    error: this.state.email.errorMsg
                },{
                    id: "password",
                    label: "Password",
                    type: "password",
                    onChange: this.handleInputChange,
                    error: this.state.password.errorMsg
                }
            ],
            onSubmit: this.handleSubmit
        };

        return (
            <div>
                <LoginForm formData={formData} />

                {
                    this.state.requestPasswordChange ?
                        {/*<Modal sizeClass={"grid__col-3"}>
                            <ChangePasswordController handleCancel={this.handlePasswordChangeCancel}/>
                        </Modal>*/}
                        : ""
                }
            </div>
        )
    }
}

export default connect()(LoginController);