import React from "react";
import Loader from "../loader/Loader";

const RedirectView = () => {
    return (
        <div className="grid grid--justify-center">
            <h1>Redirecting...</h1>
            <Loader classNames="grid grid--align-center grid--align-self-center" />
            <a href={location.href} className="margin-top--2">
                Go directly to {location.href}
            </a>
        </div>
    );
};

export default RedirectView;
