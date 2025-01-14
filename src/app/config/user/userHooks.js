import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";
import { startRefeshAndSession } from "../../config/user/userActions";
import sessionManagement from "../../utilities/sessionManagement";
import SessionManagement, { createDefaultExpireTimes, isSessionExpired, convertUTCToJSDate } from "dis-authorisation-client-js";
import { getAuthState, updateAuthState } from "../../utilities/auth";
import fp from "lodash/fp";
import { store } from "../../config/store";

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
            const enableNewSignIn = fp.get("config.enableNewSignIn")(props);
            if (isSessionExpired()) {
                if (enableNewSignIn) {
                    console.debug("Timers / enableNewSignIn: requesting a new access_token");
                    user.renewSession()
                        .then(res => {
                            // update the authState, start the session timer with the nest session response value
                            // & restart the refresh timer with the existing refresh value.
                            const expirationTime = convertUTCToJSDate(fp.get("expirationTime")(res));
                            SessionManagement.initialiseSessionExpiryTimers(expirationTime, null);
                        })
                        .catch(err => console.error(err));
                } else {
                    console.debug("[FLORENCE] Timers: extending session & refresh timers");
                    // If we are not behind the enableNewSignIn then just extend the session & refresh for 12 hours
                    const expireTimes = createDefaultExpireTimes(12);
                    SessionManagement.initialiseSessionExpiryTimers(expireTimes.session_expiry_time, expireTimes.refresh_expiry_time);
                }
            } else {
                if (enableNewSignIn) {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    SessionManagement.initialiseSessionExpiryTimers();
                } else {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    SessionManagement.initialiseSessionExpiryTimers();
                }
            }
        }
    }, [sessionTimerIsActive]);
};
