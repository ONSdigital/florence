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
        message: PropTypes.string.isRequired,
    }).isRequired,
};

class RuntimeErrorLog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DefaultLog {...this.props}>
                <div>Error message: {this.props.payload.message}</div>
            </DefaultLog>
        );
    }
}

RuntimeErrorLog.propTypes = propTypes;
export default RuntimeErrorLog;
