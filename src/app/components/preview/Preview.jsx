import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    path: PropTypes.string,
    onChange: PropTypes.func,
    onLoad: PropTypes.func,
    hidden: PropTypes.bool
};

const defaultProps = {
    path: "/"
};

export default class Preview extends Component {
    constructor(props) {
        super(props);

        this.bindWindowOnMessage();
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.path === this.props.path) {
            return false;
        }
        return true;
    }

    bindWindowOnMessage() {
        window.addEventListener("message", this.handleIframeMessage, false);
    }

    handleIframeMessage(event) {
        if (event.message !== "load") {
            return;
        }

        this.props.onChange(document.getElementById("iframe").contentWindow.document.location.pathname);
    }

    returnHiddenValue() {
        if (this.props.hidden) {
            return "none";
        }

        return "block";
    }

    render() {
        return (
            <iframe
                style={{ display: this.returnHiddenValue() }}
                id="iframe"
                className="preview__iframe"
                src={this.props.path}
                onLoad={this.props.onLoad}
            ></iframe>
        );
    }
}

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;
