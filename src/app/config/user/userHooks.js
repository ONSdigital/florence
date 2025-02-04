import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";
import SessionManagement, { isSessionExpired } from "dis-authorisation-client-js";
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
        const updateTimers = async () => {
            if (!nonAuthRoutes.includes(props.location.pathname) && !sessionTimerIsActive) {
                if (await isSessionExpired()) {
                    console.debug("[FLORENCE] Timers : requesting a new access_token");
                    user.renewSession()
                        .then(res => {
                            // update the authState, start the session timer with the new session response value
                            // & restart the refresh timer with the existing refresh value.
                            const expirationTime = fp.get("expirationTime")(res);
                            SessionManagement.initialiseSessionExpiryTimers(expirationTime);
                        })
                        .catch(err => console.error(err));
                } else {
                    console.debug("[FLORENCE] Timers: starting timers");
                    // The user has refreshed the page but the session is not expired, so just restart the timers
                    // for both refresh & session.
                    SessionManagement.initialiseSessionExpiryTimers();
                }
            }
        };

        updateTimers();
    }, [sessionTimerIsActive]);
};
