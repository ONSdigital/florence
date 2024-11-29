import React, { useEffect } from "react";
import { browserHistory } from "react-router";
import user from "../../utilities/api-clients/user";
import handleRedirect from "../../utilities/redirect";

import RedirectView from "../redirect-view/Redirect";

const Logout = ({ rootPath }) => {
    useEffect(() => {
        const logoutUser = () => {
            try {
                const redirect = new URLSearchParams(window.location.search).get("redirect");
                user.logOut();
                if (redirect) {
                    handleRedirect(redirect);
                } else {
                    browserHistory.push(`${rootPath}/login`);
                }
            } catch (error) {
                console.error("Error during logout:", error);
                browserHistory.push(`${rootPath}/login`);
            }
        };
        logoutUser();
    }, []);

    return <RedirectView />;
};

export default Logout;
