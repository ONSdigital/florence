import React, { Component } from "react";
import PropTypes from "prop-types";
import ChangePasswordRequest from "./changePasswordRequest";
import ChangePasswordConfirmed from "./changePasswordConfirmed";

const propTypes = {
    dispatch: PropTypes.func.isRequired
};

export class ChangePasswordController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSubmitted: false
        };
    }

    render() {
        const screenToShow = this.state.hasSubmitted ? <ChangePasswordConfirmed /> : <ChangePasswordRequest />;
        return <div>{screenToShow}</div>;
    }
}

ChangePasswordController.propTypes = propTypes;

export default ChangePasswordController;
