import React, { Component } from "react";
import PropTypes from "prop-types";

const defaultProps = {
    sizeClass: "grid__col-3",
};

const propTypes = {
    children: PropTypes.node,
    sizeClass: PropTypes.string,
};

export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        // Stop background page from scrolling whilst modal is active
        document.querySelector("body").style.overflow = "hidden";
    }

    componentWillUnmount() {
        // Allow background page to scroll again
        document.querySelector("body").style.overflow = "initial";
    }

    render() {
        return (
            <div className="modal__overlay">
                <div className={"modal__inner " + this.props.sizeClass}>{this.props.children}</div>
            </div>
        );
    }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;
