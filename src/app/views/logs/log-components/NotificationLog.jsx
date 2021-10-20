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
        type: PropTypes.string || PropTypes.number,
        message: PropTypes.string,
    }),
};

class NotificationLog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DefaultLog {...this.props}>
                <div>Type: {this.props.payload.type}</div>
                <div>Message: {this.props.payload.message}</div>
            </DefaultLog>
        );
    }
}

NotificationLog.propTypes = propTypes;
export default NotificationLog;
