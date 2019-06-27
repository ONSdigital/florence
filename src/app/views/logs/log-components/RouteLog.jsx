import React, { Component } from "react";
import PropTypes from "prop-types";

import DefaultLog from "./DefaultLog";

const propTypes = {
    children: PropTypes.node,
    created: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    instanceID: PropTypes.string.isRequired,
    payload: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string
    })
};

class RouteLog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DefaultLog {...this.props}>
                <div>
                    Routed to: {this.props.payload.pathname}
                    {this.props.payload.search}
                </div>
            </DefaultLog>
        );
    }
}

RouteLog.propTypes = propTypes;
export default RouteLog;
