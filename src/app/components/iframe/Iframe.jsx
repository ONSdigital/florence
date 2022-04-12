import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    path: PropTypes.string,
    onChange: PropTypes.func,
};

const defaultProps = {
    path: "/",
};

export default class Iframe extends Component {
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

    render() {
        console.log("Now Iframe has language here too", this.props.previewLanguage);
        return <iframe id="iframe" previewLanguage={this.props.previewLanguage} className="preview__iframe" src={this.props.path}></iframe>;
    }
}

Iframe.propTypes = propTypes;
Iframe.defaultProps = defaultProps;
