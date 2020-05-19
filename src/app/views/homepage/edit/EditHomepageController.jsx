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
            isGettingHomepageData: false,
            maximumNumberOfEntries: 4
        };
    }

    componentWillMount() {
        this.getHomepageData();
    }

    getHomepageData() {
        this.setState({ isGettingHomepageData: true });
        // API call to be set up at a later point
        const highlightedContent = [
            {
                simpleListHeading: "Headline One",
                simpleListDescription: "Description for Headline One"
            },
            {
                simpleListHeading: "Headline Two",
                simpleListDescription: "Description for Headline Two"
            },
            {
                simpleListHeading: "Headline Three",
                simpleListDescription: "Description for Headline Three"
            }
        ];
        const serviceMessage = "";

        this.setState({
            homepageData: { highlightedContent, serviceMessage },
            isGettingHomepageData: false
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
                    disableForm={this.state.isGettingHomepageData}
                    maximumNumberOfEntries={this.state.maximumNumberOfEntries}
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
