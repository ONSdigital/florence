import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { hasValidAuthToken } from './utilities/hasValidAuthToken';
import user from './utilities/api-clients/user';
import log from './utilities/logging/log';
import ping from './utilities/api-clients/ping';

import Notifications from './global/notifications/Notifications';
import notifications from './utilities/notifications';

const propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object)
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCheckingAuthentication: false
        }
    }

    componentWillMount() {

        log.initialise();

        window.setInterval(() => {
            ping();
        }, 10000);

        this.setState({isCheckingAuthentication: true});
        hasValidAuthToken().then(isValid => {
            if (isValid) {
                const email = localStorage.getItem("loggedInAs");
                if (!email) {
                    //FIXME This leaves the loading spinner on screen forever - we need to either display a message, retry or do something else more graceful?
                    console.warn(`Unable to find item 'loggedInAs' from local storage`);
                    return;
                }

                user.getPermissions(email).then(userType => {
                    user.setUserState(userType);
                    this.setState({isCheckingAuthentication: false});
                }).catch(error => {
                    this.setState({isCheckingAuthentication: false});
                    notifications.add({
                        type: "warning",
                        message: "Unable to start Florence due to an error getting your account's permissions. Please try refreshing Florence.",
                        autoDismiss: 8000,
                        isDismissable: true
                    });
                    log.event("Error getting a user's permissions on startup", log.error(error));
                    console.error("Error getting a user's permissions on startup", error);
                });
                return;
            }
            this.setState({isCheckingAuthentication: false});
        })
    }

    render() {
        return (
            <div>
                {   
                    this.state.isCheckingAuthentication ?
                        <div className="grid grid--align-center grid--align-self-center grid--full-height">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                        :
                        this.props.children
                }
                <Notifications notifications={this.props.notifications} />
            </div>
        )
    }
}

App.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        notifications: state.state.notifications
    }
}

export default connect(mapStateToProps)(App);