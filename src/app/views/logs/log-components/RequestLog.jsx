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
        status: PropTypes.number,
        message: PropTypes.string,
        URI: PropTypes.string,
        method: PropTypes.string,
        retryCount: PropTypes.number,
        willRetry: PropTypes.bool
    })
};

class RouteLog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DefaultLog {...this.props}>
                {this.props.payload.URI && <div>URI: {this.props.payload.URI}</div>}
                {this.props.payload.method && <div>Method: {this.props.payload.method}</div>}
                {this.props.payload.status && <div>Status: {this.props.payload.status}</div>}
                {this.props.payload.message && <div>Message: {this.props.payload.message}</div>}
            </DefaultLog>
        );
    }
}

RouteLog.propTypes = propTypes;
export default RouteLog;
