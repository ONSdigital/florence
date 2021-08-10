import React, { Component } from "react";
import PropTypes from "prop-types";
import SetForgottenPasswordRequest from "./setForgottenPasswordRequest";
import SetForgottenPasswordConfirmed from "./setForgottenPasswordConfirmed";

const propTypes = {
    dispatch: PropTypes.func.isRequired
};

export class SetForgottenPasswordController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false
        };
    }

    render() {
        const screenToShow = this.state.hasSubmitted ? <SetForgottenPasswordConfirmed /> : <SetForgottenPasswordRequest />;
        return <div>{screenToShow}</div>;
    }
}

SetForgottenPasswordController.propTypes = propTypes;

export default SetForgottenPasswordController;
