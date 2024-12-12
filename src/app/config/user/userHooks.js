import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";
import { startRefeshAndSession } from "../../config/user/userActions";
import sessionManagement from "../../utilities/sessionManagement";
import SessionManagement from "dis-authorisation-client-js";
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

const renewSessionSuccess = expirationTime => {
    const refresh_expiry_time = fp.get("refresh_expiry_time")(getAuthState());
    console.log("[STORAGE] expirationTime: ", expirationTime);
    console.log("[STORAGE] refresh_expiry_time: ", refresh_expiry_time);
    store.dispatch(startRefeshAndSession(refresh_expiry_time, expirationTime));
};
const config = {
    onRenewSuccess: renewSessionSuccess,
};

SessionManagement.init(config);

export const useUpdateTimers = (props, sessionTimerIsActive, dispatch) => {
    useEffect(() => {
        if (!nonAuthRoutes.includes(props.location.pathname) && !sessionTimerIsActive) {
            const enableNewSignIn = fp.get("config.enableNewSignIn")(props);
            const authState = getAuthState(); // Get the latest authState
            const session_expiry_time = fp.get("session_expiry_time")(authState);
            const refresh_expiry_time = new Date(fp.get("refresh_expiry_time")(authState));
            if (SessionManagement.isSessionExpired(session_expiry_time)) {
                if (enableNewSignIn) {
                    console.debug("Timers / enableNewSignIn: requesting a new access_token");
                    user.renewSession()
                        .then(res => {
                            // update the authState, start the session timer with the nest session response value
                            // & restart the refresh timer with the existing refresh value.
                            const expirationTime = SessionManagement.convertUTCToJSDate(fp.get("expirationTime")(res));
                            SessionManagement.initialiseSessionExpiryTimers(expirationTime, refresh_expiry_time);
                            updateAuthState({ session_expiry_time: expirationTime });
                            updateAuthState({ refresh_expiry_time: refresh_expiry_time });
                            dispatch(startRefeshAndSession(fp.get("refresh_expiry_time")(authState), expirationTime));
                        })
                        .catch(err => console.error(err));
                } else {
                    console.debug("[FLORENCE] Timers: extending session & refresh timers");
                    // If we are not behind the enableNewSignIn then just extend the session & refresh for 12 hours
                    const expireTimes = SessionManagement.createDefaultExpireTimes(12);
                    SessionManagement.initialiseSessionExpiryTimers(expireTimes.session_expiry_time, expireTimes.refresh_expiry_time);
                    updateAuthState({ session_expiry_time: expireTimes.session_expiry_time });
                    updateAuthState({ refresh_expiry_time: expireTimes.refresh_expiry_time });
                }
            } else {
                if (enableNewSignIn) {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    const session_expiry_time = fp.get("session_expiry_time")(authState);
                    SessionManagement.initialiseSessionExpiryTimers(new Date(session_expiry_time), refresh_expiry_time);
                    updateAuthState({ session_expiry_time: session_expiry_time });
                    updateAuthState({ refresh_expiry_time: refresh_expiry_time });
                    dispatch(startRefeshAndSession(fp.get("refresh_expiry_time")(authState), session_expiry_time));
                } else {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    const session_expiry_time = fp.get("session_expiry_time")(authState);
                    SessionManagement.initialiseSessionExpiryTimers(new Date(session_expiry_time), null);
                    updateAuthState({ session_expiry_time: session_expiry_time });
                    dispatch(startRefeshAndSession(null, session_expiry_time));
                }
            }
        }
    }, [sessionTimerIsActive]);
};
