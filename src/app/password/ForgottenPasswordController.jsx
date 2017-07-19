import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import ForgottenPasswordForm from './ForgottenPasswordForm';
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

class ForgottenPasswordController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: {
                value: "",
                errorMsg: ""
            },
            isSubmitting: false,
            passwordResetComplete: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(push(`${this.props.rootPath}/collections`));
        }
    }

    postPasswordReset(body) {
        return http.post('/zebedee/passwordreset', body);
    }

    handlePasswordReset(email) {
        this.postPasswordReset({email: email}).then(() => {
            this.setState({
                passwordResetComplete: true
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

        this.setState({ isSubmitting: true });

        this.handlePasswordReset(this.state.email.value);

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
        }
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
                }
            ],
            onSubmit: this.handleSubmit,
            isSubmitting: this.state.isSubmitting
        };

        return (
            <div>
                { this.state.passwordResetComplete ? "Password reset complete - check your email" : 
                <ForgottenPasswordForm formData={formData} rootPath={this.props.rootPath} />
                }
            </div>
        )
    }
}

ForgottenPasswordController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(ForgottenPasswordController);