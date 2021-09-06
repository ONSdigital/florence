import React from "react";
import PropTypes from "prop-types";

import NavBar from "./NavBar";

const propTypes = {
    children: PropTypes.node.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

const Layout = ({ location, children }) => {
    return (
        <div>
            <NavBar location={location} />
            {children}
        </div>
    );
};

export default Layout;

Layout.propTypes = propTypes;
