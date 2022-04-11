import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const propTypes = {
    path: PropTypes.string,
    onChange: PropTypes.func,
    language: PropTypes.string,
};

const defaultProps = {
    path: "/",
};

export class Iframe extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
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
    console.log(this.props);

    console.log(state);
    console.log(state.language);
    console.log(state.language.language);

    return {
        language: state.language.language,
    };
}

export default connect(mapStateToProps)(Iframe);
