import user from "../../utilities/api-clients/user";
import { useEffect, useState } from "react";

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
