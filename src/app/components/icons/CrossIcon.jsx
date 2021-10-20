import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    className: PropTypes.string,
    ariaLabel: PropTypes.string,
    fill: PropTypes.string
};

const defaultProps = {
    className: "svg-icon--hide-notification",
    ariaLabel: "Hide icon",
    fill: "#FFFFFF"
};

class CrossIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <svg className={this.props.className} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={this.props.ariaLabel}>
                <path
                    d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                    fill={this.props.fill}
                />
            </svg>
        );
    }
}

CrossIcon.propTypes = propTypes;
CrossIcon.defaultProps = defaultProps;

export default CrossIcon;
