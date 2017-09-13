import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

const propTypes = {
    children: PropTypes.node,
    created: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    instanceID: PropTypes.string.isRequired
}

class DefaultLog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const date = new Date(this.props.created);
        const formattedDate = dateFormat(date, "HH:MM:ss.L, ddd d mmm yyyy");
        return (
            <div className="log">
                <div className="log__type">{(this.props.type).replace("_", " ").toLowerCase()}</div>
                <div className="log__date">Logged: {formattedDate}</div>
                <div>Location: {this.props.location}</div>
                <div>Session ID: {this.props.instanceID}</div>
                {this.props.children}
            </div>
        )
    }
}

DefaultLog.propTypes = propTypes;
export default DefaultLog;