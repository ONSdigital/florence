import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import Modal from '../components/Modal';
import ChangePasswordController from '../components/change-password/ChangePasswordController';
import notifications from '../utilities/notifications';

import http from '../utilities/http';
import { errCodes } from '../utilities/errorCodes'
import user from '../utilities/user';
import cookies from '../utilities/cookies';
import redirectToMainScreen from '../utilities/redirectToMainScreen';



const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired
};

class VerifyController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPasswordChange: false,
            email: this.props.location.query.email,
            code: this.props.location.query.code,
        };

        this.handlePasswordChangeCancel = this.handlePasswordChangeCancel.bind(this);
        this.handlePasswordChangeSuccess = this.handlePasswordChangeSuccess.bind(this);
    }

    postVerifyCredentials(body) {
        return http.post('/zebedee/verify', body);
    }

    postLoginCredentials(body) {
        return http.post('/zebedee/login', body);
    }

    componentDidMount() {
        this.postVerifyCredentials({
            email: this.state.email,
            code: this.state.code,
        }).catch(error => {
            if (error) {
                const notification = {
                    type: 'warning',
                    isDismissable: true,
                    autoDismiss: 15000
                };

                switch (error.status) {
                    case (400): {
                        const email = Object.assign({}, this.state.email, {errorMsg: "Bad request"});
                        this.setState({
                            email: email,
                            isSubmitting: false
                        });
                        break;
                    }
                    case (404): {
                        const email = Object.assign({}, this.state.email, {errorMsg: "Email address not recognised"});
                        this.setState({
                            email: email,
                            isSubmitting: false
                        });
                        break;
                    }
                    case (401): {
                        const password = Object.assign({}, this.state.email, {errorMsg: "Incorrect verification code"});
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

    handleLogin(credentials) {
        this.postLoginCredentials(credentials).then(accessToken => {
            cookies.add("access_token", accessToken);
            user.getPermissions(this.state.email).then(userType => {
                user.setUserState(userType);
                redirectToMainScreen(this.props.location.query.redirect);
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

    handlePasswordChangeSuccess(newPassword) {
        const credentials = {
            email: this.state.email,
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
        return (
            <div>
                {
                    this.state.requestPasswordChange ?
                        <Modal sizeClass={"grid__col-3"}>
                            <ChangePasswordController
                                handleCancel={this.handlePasswordChangeCancel}
                                handleSuccess={this.handlePasswordChangeSuccess}
                                code={this.state.code}
                                email={this.state.email}
                                createPassword={true}
                            />
                        </Modal>
                        : "Verifying your email address, please wait"
                }
            </div>
        )
    }
}

VerifyController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(VerifyController);