import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";
import { startRefeshAndSession } from "../../config/user/userActions";
import sessionManagement from "../../utilities/sessionManagement";
import { getAuthState } from "../../utilities/auth";
import fp from "lodash/fp";

const nonAuthRoutes = ["/florence/login", "/florence/forgotten-password", "/florence/password-reset"];

export const useGetPermissions = (props, authState, setShouldUpdateAccessToken) => {
    const [userState, setUserState] = useState();
    useEffect(() => {
        if (!nonAuthRoutes.includes(props.location.pathname)) {
            if (!authState) {
                user.getPermissions().then(userData => {
                    // TODO this needs to be removed when we get a correct 401 status back from zebedee.
                    if (userData === "Access Token required but none provided.") {
                        console.error("Error fetching permissions");
                        return null;
                    }
                    setShouldUpdateAccessToken(true);
                    setUserState(userData);
                });
            } else {
                setShouldUpdateAccessToken(false);
                setUserState(authState);
            }
        }
    }, []);
    return userState;
};

export const useUpdateTimers = (props, sessionTimerIsActive, dispatch) => {
    useEffect(() => {
        if (!nonAuthRoutes.includes(props.location.pathname) && !sessionTimerIsActive) {
            const authState = getAuthState(); // Get the latest authState
            const session_expiry_time = fp.get("session_expiry_time")(authState);
            const refresh_expiry_time = new Date(fp.get("refresh_expiry_time")(authState));
            if (sessionManagement.isSessionExpired(session_expiry_time)) {
                console.debug("Timers : requesting a new access_token");
                user.renewSession()
                    .then(res => {
                        // update the authState, start the session timer with the nest session response value
                        // & restart the refresh timer with the existing refresh value.
                        const expirationTime = sessionManagement.convertUTCToJSDate(fp.get("expirationTime")(res));
                        sessionManagement.initialiseSessionExpiryTimers(expirationTime, refresh_expiry_time);
                        dispatch(startRefeshAndSession(fp.get("refresh_expiry_time")(authState), expirationTime));
                    })
                    .catch(err => console.error(err));
            } else {
                console.debug("[FLORENCE] Timers: starting timers");
                // The user has refreshed the page but the session is not expired, so just restart the timers
                // for both refresh & session.
                const session_expiry_time = fp.get("session_expiry_time")(authState);
                sessionManagement.initialiseSessionExpiryTimers(new Date(session_expiry_time), refresh_expiry_time);
                dispatch(startRefeshAndSession(fp.get("refresh_expiry_time")(authState), session_expiry_time));
            }
        }
    }, [sessionTimerIsActive]);
};
