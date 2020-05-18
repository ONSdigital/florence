import React, { Component } from "react";
import EditHomepage from "./EditHompage";
import PropTypes from "prop-types";

import url from "../../../utilities/url";
import { push } from "react-router-redux";

class EditHomepageController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedContent: []
        };
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <EditHomepage highlightedContent={this.state.highlightedContent} handleBackButton={this.handleBackButton} />
            </div>
        );
    }
}

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired
    }),
    dispatch: PropTypes.func.isRequired
};

EditHomepageController.propTypes = propTypes;

export default EditHomepageController;
