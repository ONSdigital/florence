import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { hasValidAuthToken } from "./utilities/hasValidAuthToken";
import user from "./utilities/api-clients/user";
import log from "./utilities/logging/log";
import ping from "./utilities/api-clients/ping";
import Notifications from "./components/notifications";
import notifications from "./utilities/notifications";

const App = props => {
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(true);

    useEffect(() => {
        log.initialise();

        window.setInterval(() => {
            ping();
        }, 10000);
        Authenticate();
    }, []);

    function Authenticate() {
        // this.setState({ isCheckingAuthentication: true });
        hasValidAuthToken().then(isValid => {
            if (isValid) {
                const email = localStorage.getItem("loggedInAs");
                if (!email) {
                    user.logOut();
                    setIsCheckingAuthentication(false);
                    return console.warn(`Unable to find item 'loggedInAs' from local storage`);
                }

                user.getPermissions(email)
                    .then(userType => {
                        user.setUserState(userType);
                        setIsCheckingAuthentication(false);
                    })
                    .catch(error => {
                        setIsCheckingAuthentication(false);
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
            setIsCheckingAuthentication(false);
        });
    }

    return (
        <div>
            {isCheckingAuthentication && (
                <div className="grid grid--align-center grid--align-self-center grid--full-height">
                    <div className="loader loader--large loader--dark"></div>
                </div>
            )}
            {props.children}
            <Notifications notifications={props.notifications} />
        </div>
    );
};

App.propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object)
};

function mapStateToProps(state) {
    return {
        notifications: state.state.notifications
    };
}

export default connect(mapStateToProps)(App);
