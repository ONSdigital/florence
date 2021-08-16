import React from "react";
import PropTypes from "prop-types";

import NavBar from "./NavBar";

const propTypes = {
    children: PropTypes.node.isRequired
};

const Layout = ({ children }) => {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
};

export default Layout;

Layout.propTypes = propTypes;
