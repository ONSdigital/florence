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

class PasswordController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requestPasswordChange: true,
            passwordChangeComplete: false,
            email: this.props.location.query.email ? this.props.location.query.email : this.props.email
        };

        this.handlePasswordChangeSuccess = this.handlePasswordChangeSuccess.bind(this);
        this.handlePasswordChangeFailure = this.handlePasswordChangeFailure.bind(this);
    }

    handlePasswordChangeSuccess(newPassword) {
        const credentials = {
            email: this.props.email,
            password: newPassword
        };

        this.setState({passwordChangeComplete: true});
    }

    handlePasswordChangeFailure(error) {
        this.setState({passwordChangeError: error});
    }

    render() {
        return (
            <div>
                { this.state.passwordChangeError ? "Error changing password: " + this.state.passwordChangeError.message : ""}
                {
                    this.state.passwordChangeComplete ? "Your password has been updated" : 
                    <div className="grid__col-3">
                        <ChangePasswordController
                            handleSuccess={this.handlePasswordChangeSuccess}
                            handleFailure={this.handlePasswordChangeFailure}
                            email={this.state.email}
                            changePassword={true}
                        />
                    </div>
                }
            </div>
        )
    }
}

PasswordController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath,
        email: state.state.user.email,
    }
}

export default connect(mapStateToProps)(PasswordController);