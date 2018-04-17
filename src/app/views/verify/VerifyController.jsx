import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import user from '../../utilities/api-clients/user'
import notifications from '../../utilities/notifications'
import ChangePasswordController from '../../components/change-password/ChangePasswordController'
import Modal from '../../components/Modal';
import log, {eventTypes} from '../../utilities/log'
import cookies from '../../utilities/cookies'
import redirectToMainScreen from '../../utilities/redirectToMainScreen'

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    email: PropTypes.string,
    verifyCode: PropTypes.string
};

export class VerifyController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorVerifyingEmail: false,
            isCheckingEmail: false,
            isLoggingUserIn: false,
            showChangePassword: false
        };

        this.handleSuccess = this.handleSuccess.bind(this);
    }

    componentWillMount() {
        if (!this.props.email || !this.props.verifyCode) {
            this.setState({errorVerifyingEmail: true});
            return;
        }
        if (cookies.get("access_token")) {
            cookies.remove("access_token");
        }
        this.checkEmailVerification();
    }

    async checkEmailVerification() {
        this.setState({isCheckingEmail: true});
        
        await user.checkEmailVerification(this.props.email, this.props.verifyCode).catch(error => {
            this.setState({isCheckingEmail: false});
            switch (error.status) {
                case(403): {
                    const notification = {
                        type: "neutral",
                        message: `You don't have permission to verify this email address`,
                        autoDismiss: 10000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.setState({errorVerifyingEmail: true});
                    break;
                }
                case(404): {
                    const notification = {
                        type: "neutral",
                        message: `Email address ${this.props.email} was not recognised. Check the link in your email and try again.`,
                        autoDismiss: 10000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.setState({errorVerifyingEmail: true});
                    break;
                }
                case(417): {
                    this.setState({showChangePassword: true});
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred. Please retry the link included in the email sent to '${this.props.email}'`,
                        autoDismiss: 10000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.setState({errorVerifyingEmail: true});
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error logging in with email verify code. Error: ${JSON.stringify(error)}`});
        });

        this.setState({isCheckingEmail: false});
    }

    async handleSuccess(newPassword) {
        this.setState({isLoggingUserIn: true});
        const accessToken = await user.login(this.props.email, newPassword).catch(error => {
            this.setState({isLoggingUserIn: false});
            switch (error.status) {
                case(401): {
                    const notification = {
                        type: "warning",
                        message: `Error logging in with new password. Please refresh the page and try again.`
                    }
                    notifications.add(notification);
                    break;
                }
                case(403): {
                    const notification = {
                        type: "neutral",
                        message: `You don't have permission to verify this email address`,
                        autoDismiss: 5000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(404): {
                    const notification = {
                        type: "neutral",
                        message: `Email address ${this.props.email} was not recognised. Check the link in your email and try again.`,
                        autoDismiss: 6000,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case(417): {
                    this.setState({showChangePassword: true});
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred. Please try the link included in the email sent to ${this.props.email}`,
                        isDismissable: true,
                        autoDismiss: 6000
                    };
                    notifications.add(notification);
                    break;
                }
            }

            console.error(`Error logging in with new password. User's email: ${this.props.email}`, error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error logging in with new password. User's email: ${this.props.email}. Error: ${JSON.stringify(error)}`});
        });

        if (!accessToken) {
            return;
        }

        cookies.add("access_token", accessToken);
        user.getPermissions(this.props.email).then(userType => {
            user.setUserState(userType);
            if (user.getOldUserType(userType) == "VIEWER") {
                this.props.dispatch(push(`${this.props.rootPath}/verify/complete`));
                return;
            }
            redirectToMainScreen(`${this.props.rootPath}/collections`);
        });
    }

    render() {
        if (this.state.errorVerifyingEmail) {
            return (
                <div className="grid grid--justify-center">
                    <h1 className="grid__col-8">Error verifying email</h1>
                    <p className="grid__col-8 font-size--16">
                        Unable to verifying email address. Please check the link in the email that brought you to this page and try again.
                    </p>
                </div>
            );
        }

        if (this.state.showChangePassword) {
            return (
                <Modal sizeClass="grid__col-10 grid__col-lg-3 grid__col-md-5 grid__col-sm-8 grid__col-xs-10">
                    <ChangePasswordController
                        currentPassword={this.props.verifyCode}
                        email={this.props.email}
                        handleSuccess={this.handleSuccess}
                        hideCancel={true}
                    />
                </Modal>
            );
        }

        return <div></div>;
    }
}

VerifyController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        email: state.routing.locationBeforeTransitions.query.email,
        verifyCode: state.routing.locationBeforeTransitions.query.code,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(VerifyController);