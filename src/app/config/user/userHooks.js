import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";
import { startRefeshAndSession } from "../../config/user/userActions";
import sessionManagement from "../../utilities/sessionManagement";
import { getAuthState } from "../../utilities/auth";
import fp from "lodash/fp";

export const useGetPermissions = (authState, setShouldUpdateAccessToken) => {
    const [userState, setUserState] = useState();
    useEffect(() => {
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
    }, []);
    return userState;
};

export const useUpdateTimers = (props, sessionTimerIsActive, dispatch) => {
    useEffect(() => {
        if (props.location.pathname !== "/florence/login" && !sessionTimerIsActive) {
            const enableNewSignIn = fp.get("config.enableNewSignIn")(props);
            const authState = getAuthState(); // Get the lastest authState
            const session_expiry_time = fp.get("session_expiry_time")(authState);
            const refresh_expiry_time = new Date(fp.get("refresh_expiry_time")(authState));
            if (sessionManagement.isSessionExpired(session_expiry_time)) {
                if (enableNewSignIn) {
                    console.debug("Timers / enableNewSignIn: requesting a new access_token");
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
                    console.debug("[FLORENCE] Timers: extending session & refresh timers");
                    // If we are not behind the enableNewSignIn then just extend the session & refresh for 12 hours
                    const expireTimes = sessionManagement.createDefaultExpireTimes(12);
                    sessionManagement.initialiseSessionExpiryTimers(expireTimes.session_expiry_time, expireTimes.refresh_expiry_time);
                }
            } else {
                if (enableNewSignIn) {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    const session_expiry_time = fp.get("session_expiry_time")(authState);
                    sessionManagement.initialiseSessionExpiryTimers(new Date(session_expiry_time), refresh_expiry_time);
                    dispatch(startRefeshAndSession(fp.get("refresh_expiry_time")(authState), session_expiry_time));
                } else {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    const session_expiry_time = fp.get("session_expiry_time")(authState);
                    sessionManagement.initialiseSessionExpiryTimers(new Date(session_expiry_time), null);
                    dispatch(startRefeshAndSession(null, session_expiry_time));
                }
            }
        }
    }, [sessionTimerIsActive]);
};
