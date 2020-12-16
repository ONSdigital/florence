import React, { Component } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import url from "../../utilities/url";

import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import Input from "../../components/Input";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired
};

export class CreateContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentTypes: [
                {
                    title: "Old workspace",
                    id: "workspace",
                    details: ["Create/edit content via the old workspace"],
                    url: `${url.resolve("../../../")}/workspace?collection=${this.props.params.collectionID}`,
                    externalLink: true
                },
                {
                    title: "Filterable dataset",
                    id: "cmd-filterable-datasets",
                    details: ["Create/edit datasets and/or versions for filterable (CMD) datasets"],
                    url: url.resolve("../") + "/datasets"
                },
                {
                    title: "Homepage",
                    id: "homepage",
                    url: url.resolve("../") + "/homepage"
                }
            ],
            filteredContentTypes: [],
            searchTerm: ""
        };
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    };

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredContentTypes = this.state.contentTypes.filter(
            contentType => contentType.title.toLowerCase().search(searchTerm) !== -1 || contentType.id.toLowerCase().search(searchTerm) !== -1
        );
        this.setState({
            filteredContentTypes,
            searchTerm
        });
    };

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664;{" "}
                        <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                            Back
                        </button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select a content type to create/edit</h1>
                    <Input id="search-content-types" placeholder="Search by name" onChange={this.handleSearchInput} />
                    <SimpleSelectableList rows={this.state.filteredContentTypes.length ? this.state.filteredContentTypes : this.state.contentTypes} />
                </div>
            </div>
        );
    }
}

CreateContent.propTypes = propTypes;

export default CreateContent;
