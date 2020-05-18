import React, { Component } from "react";
import EditHomepage from "./EditHomepage";
import PropTypes from "prop-types";

import url from "../../../utilities/url";
import { push } from "react-router-redux";

class EditHomepageController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            homepageData: {
                highlightedContent: [],
                serviceMessage: ""
            },
            isGettingHighlightedContent: false
        };
    }

    componentWillMount() {
        this.getHomepageData();
    }

    getHomepageData() {
        // hardcoded for testing purposes
        this.setState({ isGettingHighlightedContent: true });
        const highlightedContent = [
            {
                simpleListHeading: "Headline One",
                simpleListDescription: "This is the description for headline one."
            }
        ];
        const serviceMessage = "This is a test service message.";
        this.setState({
            homepageData: { highlightedContent, serviceMessage },
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
                <EditHomepage
                    homepageData={this.state.homepageData}
                    handleBackButton={this.handleBackButton}
                    disableForm={this.state.isGettingHighlightedContent}
                />
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
