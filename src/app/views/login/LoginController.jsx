import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';
import Modal from '../../components/Modal';
import ChangePasswordController from '../../components/change-password/ChangePasswordController';
import notifications from '../../utilities/notifications';

import http from '../../utilities/http';
import { errCodes } from '../../utilities/errorCodes'
import user from '../../utilities/api-clients/user';
import cookies from '../../utilities/cookies';
import redirectToMainScreen from '../../utilities/redirectToMainScreen';
import log, { eventTypes } from '../../utilities/log';


const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
    location: PropTypes.object
};

export class LoginController extends Component {
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
            requestPasswordChange: false,
            isSubmitting: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChangeCancel = this.handlePasswordChangeCancel.bind(this);
        this.handlePasswordChangeSuccess = this.handlePasswordChangeSuccess.bind(this);
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    postLoginCredentials(body) {
        return http.post('/zebedee/login', body, true, true);
    }

    handleLogin(credentials) {
        this.postLoginCredentials(credentials).then(accessToken => {
            cookies.add("access_token", accessToken);
            user.getPermissions(this.state.email.value).then(userType => {
                user.setUserState(userType);
                redirectToMainScreen(this.props.location.query.redirect);
            }).catch(error => {
                this.setState({isSubmitting: false});
                notifications.add({
                    type: "warning",
                    message: "Unable to login due to an error getting your account's permissions. Please refresh and try again.",
                    autoDismiss: 8000,
                    isDismissable: true
                });
                log.add(eventTypes.unexpectedRuntimeError, {message: `Error getting a user's permissions on login: ${JSON.stringify(error)}`});
                console.error("Error getting a user's permissions on login", error);
            });
        }).catch(error => {
            if (error) {
                const notification = {
                    type: 'warning',
                    isDismissable: true,
                    autoDismiss: 15000
                };

                switch (error.status) {
                    case (404): {
                        const email = Object.assign({}, this.state.email, {errorMsg: "Email address not recognised"});
                        this.setState({
                            email: email,
                            isSubmitting: false
                        });
                        break;
                    }
                    case (401): {
                        const password = Object.assign({}, this.state.email, {errorMsg: "Incorrect password"});
                        this.setState({
                            password: password,
                            isSubmitting: false
                        });
                        break;
                    }
                    case (417): {
                        this.setState({
                            requestPasswordChange: true
                        });
                        break;
                    }
                    case ('UNEXPECTED_ERR'): {
                        console.error(errCodes.UNEXPECTED_ERR);
                        notification.message = errCodes.UNEXPECTED_ERR;
                        notifications.add(notification);
                        break;
                    }
                    case ('RESPONSE_ERR'): {
                        console.error(errCodes.RESPONSE_ERR);
                        notification.message = errCodes.RESPONSE_ERR;
                        notifications.add(notification);
                        break;
                    }
                    case ('FETCH_ERR'): {
                        console.error(errCodes.FETCH_ERR);
                        notification.message = errCodes.FETCH_ERR;
                        notifications.add(notification);
                        break;
                    }
                }
            }
            this.setState({isSubmitting: false});
        });

    }

    handleSubmit(event) {
        event.preventDefault();

        const credentials = {
            email: this.state.email.value,
            password: this.state.password.value
        };

        this.setState({ isSubmitting: true });

        this.handleLogin(credentials);

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

    handlePasswordChangeSuccess(newPassword) {
        const credentials = {
            email: this.state.email.value,
            password: newPassword
        };

        this.handleLogin(credentials)

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
            onSubmit: this.handleSubmit,
            isSubmitting: this.state.isSubmitting
        };

        return (
            <div>
                <LoginForm formData={formData} />

                {
                    this.state.requestPasswordChange ?
                        <Modal sizeClass={"grid__col-3"}>
                            <ChangePasswordController
                                handleCancel={this.handlePasswordChangeCancel}
                                handleSuccess={this.handlePasswordChangeSuccess}
                                currentPassword={this.state.password.value}
                                email={this.state.email.value}
                            />
                        </Modal>
                        : ""
                }
            </div>
        )
    }
}

LoginController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(LoginController);