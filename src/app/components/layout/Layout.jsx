import React, { Component, useEffect, useState } from "react";
import log from "../../utilities/logging/log";
import ping from "../../utilities/api-clients/ping";
import user from "../../utilities/api-clients/user";
import Notifications from "../notifications";
import NavBar from "../../components/navbar";
import Popouts from "../popouts/Popouts";
import { useGetPermissions, useUpdateTimers } from "../../config/user/userHooks";
import { getAuthState } from "../../utilities/auth";
import fp from "lodash/fp";

import { useDispatch } from "react-redux";

const Layout = props => {
    const dispatch = useDispatch();
    let authState = getAuthState();
    const sessionTimerIsActive = fp.get("user.sessionTimer.active")(props);
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(false);
    const [shouldUpdateAccessToken, setShouldUpdateAccessToken] = useState(false);
    // Get Permissions
    const userPermissions = useGetPermissions(props, authState, setShouldUpdateAccessToken);
    // Check timers & update if required
    useUpdateTimers(props, sessionTimerIsActive, dispatch);
    // Update store with permissions
    useEffect(() => {
        setIsCheckingAuthentication(false);
        if (userPermissions) {
            user.setUserState(userPermissions);
            const email = fp.get("email")(getAuthState());
            if (!email) {
                user.logOut();
                setIsCheckingAuthentication(false);
                console.warn(`Unable to find auth token in local storage`);
                return;
            }
        }
    }, [userPermissions, isCheckingAuthentication]);

    useEffect(() => {
        log.initialise();
        window.setInterval(() => {
            ping();
        }, 10000);
    }, []);

    if (isCheckingAuthentication) {
        return (
            <div className="grid grid--align-center grid--align-self-center grid--full-height">
                <div className="loader loader--large loader--dark" />
            </div>
        );
    }

    return (
        <React.StrictMode>
            <NavBar location={props.location} />
            {props.children}
            {props.notifications && <Notifications notifications={props.notifications} />}
            {props.popouts && <Popouts popouts={props.popouts} />}
        </React.StrictMode>
    );
};

export default Layout;
