import React, { Component, useEffect, useState } from "react";
import { hasValidAuthToken } from "../../utilities/hasValidAuthToken";
import log from "../../utilities/logging/log";
import notifications from "../../utilities/notifications";
import ping from "../../utilities/api-clients/ping";
import sessionManagement from "../../utilities/sessionManagement";
import user from "../../utilities/api-clients/user";
import Notifications from "../notifications";
import NavBar from "../../components/navbar";

const Layout = props => {
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(null);
    
    useEffect(() => {
        log.initialise();

        window.setInterval(() => {
            ping();
        }, 10000);

        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        setIsCheckingAuthentication(true);
        hasValidAuthToken().then(isValid => {
            if (isValid) {
                const email = localStorage.getItem("loggedInAs");
                if (!email) {
                    user.logOut();
                    setIsCheckingAuthentication(false);
                    console.warn(`Unable to find item 'loggedInAs' from local storage`);
                    return;
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
                            isDismissable: true,
                        });
                        log.event("Error getting a user's permissions on startup", log.error(error));
                        console.error("Error getting a user's permissions on startup", error);
                    });
                return;
            }
            setIsCheckingAuthentication(false);
        });

        if (props.location.pathname !== "/florence/login" && props.enableNewSignIn) {
            sessionManagement.startSessionExpiryTimers();
        }
    };

    if (isCheckingAuthentication)
        return (
            <div className="grid grid--align-center grid--align-self-center grid--full-height">
                <div className="loader loader--large loader--dark" />
            </div>
        );

    return (
        <div>
            <NavBar location={props.location} />
            {props.children}
            {props.notifications && <Notifications notifications={props.notifications} />}
        </div>
    );
};

export default Layout;
