import React from "react";
import PropTypes from "prop-types";
import NavBar from "../components/navbar";

const Layout = ({ location, children }) => {
    return (
        <>
            <NavBar location={location} />
            {children}
        </>
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired
};
