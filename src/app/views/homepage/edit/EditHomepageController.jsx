import React, { Component } from "react";
import EditHomepage from "./EditHomepage";
import PropTypes from "prop-types";

import url from "../../../utilities/url";
import { push } from "react-router-redux";

class EditHomepageController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                highlightedContent: []
            },
            isGettingHighlightedContent: false
        };
    }

    componentWillMount() {
        this.getHighlightedContent();
    }

    getHighlightedContent() {
        // hardcoded for testing purposes
        this.setState({ isGettingHighlightedContent: true });
        const highlightedContent = [
            {
                simpleListHeading: "Headline One",
                simpleListDescription: "This is the description for headline one."
            }
        ];
        this.setState({
            data: { highlightedContent },
            isGettingHighlightedContent: false
        });
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <EditHomepage data={this.state.data} handleBackButton={this.handleBackButton} disableForm={this.state.isGettingHighlightedContent} />
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
