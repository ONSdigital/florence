import React, { Component } from "react";
import { connect } from "react-redux";
import { getPreviewLanguage } from "../../config/selectors";
import PropTypes from "prop-types";

const propTypes = {
    path: PropTypes.string,
    onChange: PropTypes.func,
    previewLanguage: PropTypes.oneOf(["en", "cy"]).isRequired,
};

const defaultProps = {
    path: "/",
};

export class Iframe extends Component {
    constructor(props) {
        super(props);
        this.bindWindowOnMessage();
    }

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.path === this.props.path) {
    //         return false;
    //     }
    //     return true;
    // }

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
        return <iframe id="iframe" className="preview__iframe" src={this.props.path}></iframe>;
    }
}

Iframe.propTypes = propTypes;
Iframe.defaultProps = defaultProps;

export function mapStateToProps(state) {
    return {
        previewLanguage: getPreviewLanguage(state),
    };
}

export default connect(mapStateToProps)(Iframe);
