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
import {getAuthToken} from "../../utilities/auth";
import fp from "lodash/fp";

const Layout = props => {
    const [isCheckingAuthentication, setIsCheckingAuthentication] = useState(false);
    const userStateFromAuthToken = getAuthToken();
    const userPermissions = useGetPermissions(userStateFromAuthToken);
    useEffect(() => {
        setIsCheckingAuthentication(false);
        if (userPermissions) {
            user.setUserState(userPermissions);
            const email = fp.get("email")(getAuthToken());
            if (!email) {
                user.logOut();
                setIsCheckingAuthentication(false);
                console.warn(`Unable to find auth token in local storage`);
                return;
            }
        } else if (!isCheckingAuthentication) {
            notifications.add({
                type: "warning",
                message: "Unable to start Florence due to an error getting your account's permissions. Please try refreshing Florence.",
                autoDismiss: 8000,
                isDismissable: true,
            });
        }
    }, [userPermissions, isCheckingAuthentication], props.user);

    useEffect(() => {
        log.initialise();

        window.setInterval(() => {
            ping();
        }, 10000);

        if (props.location.pathname !== "/florence/login" && props.enableNewSignIn) {
            sessionManagement.startSessionExpiryTimers();
        }
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