import React, { Component, useEffect, useMemo, useState } from "react";
import { hasValidAuthToken } from "../../utilities/hasValidAuthToken";
import log from "../../utilities/logging/log";
import notifications from "../../utilities/notifications";
import ping from "../../utilities/api-clients/ping";
import sessionManagement from "../../utilities/sessionManagement";
import user from "../../utilities/api-clients/user";
import Notifications from "../notifications";
import NavBar from "../../components/navbar";
import Popouts from "../popouts/Popouts";
import { useGetPermissions } from "../../config/user/userHooks";
import { getAuthState } from "../../utilities/auth";
import fp from "lodash/fp";
import { startRefeshAndSession, startSession } from "../../config/user/userActions";
import { useDispatch } from "react-redux";

const Layout = props => {
    const dispatch = useDispatch();
    const authState = getAuthState();
    const session_expiry_time = fp.get("session_expiry_time")(authState);
    const sessionTimerIsActive = fp.get("user.sessionTimer.active")(props);
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(false);
    const [shouldUpdateAccessToken, setShouldUpdateAccessToken] = useState(false);

    const userPermissions = useGetPermissions(authState, setShouldUpdateAccessToken);

    useEffect(() => {
        // Check that we are on a page reload (not coming from login or signin)
        // dispatch(startSession());
    }, []);

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
        if (props.location.pathname !== "/florence/login" && !sessionTimerIsActive) {
            if (sessionManagement.isSessionExpired(session_expiry_time)) {
                user.renewSession()
                    .then(res => {
                        const expirationTime = sessionManagement.convertUTCToJSDate(fp.get("expirationTime")(res));
                        sessionManagement.startSessionTimer(expirationTime);
                        const refresh_expiry_time = fp.get("refresh_expiry_time")(getAuthState());
                        dispatch(startRefeshAndSession(refresh_expiry_time, expirationTime));
                    })
                    .catch(err => console.error(err));
            }
        }
    }, [sessionTimerIsActive]);

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
