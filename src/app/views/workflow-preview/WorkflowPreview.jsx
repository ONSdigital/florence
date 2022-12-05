import React, { Component } from "react";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { Link } from "react-router";
import PropTypes from "prop-types";

import url from "../../utilities/url";
import notifications from "../../utilities/notifications";

import Iframe from "../../components/iframe/Iframe";
import datasets from "../../utilities/api-clients/datasets";

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }),
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired,
    }),
    dispatch: PropTypes.func.isRequired,
    enableCantabularJourney: PropTypes.bool,
};

export class WorkflowPreview extends Component {
    constructor(props) {
        super(props);
        this.state = { cantabularDataset: false };
    }

    handleBackButton = async () => {
        await this.getDatasetType(this.props.params.datasetID);
        const previousUrl = `${url.resolve("../")}${this.props.enableCantabularJourney && this.state.cantabularDataset ? "/cantabular" : ""}`;
        this.props.dispatch(push(previousUrl));
    };

    getDatasetType = datasetID => {
        return datasets.get(datasetID).then(async response => {
            const type = response.next.type;
            try {
                await datasets.getCantabularMetadata(datasetID, "en");
                this.setState({ cantabularDataset: type === "cantabular_flexible_table" || type === "cantabular_table" });
            } catch {
                console.log("Dataset ID not present in Cantabular metadata server");
            }
        });
    };

    // getPreviewIframeURL returns the url for the content to be reviewed when the url is
    // in the format: /florence/collections/collection-id/{content/to/preview/url}/preview
    // returns '/' incase the url is '/homepage' or errors
    getPreviewIframeURL = path => {
        try {
            // regex will capture the value between /florence/collections/collection-id and /preview
            // e.g. /florence/collections/collection-id/capture/group/preview => /capture/group
            const regex = /(?:\/[^/]+){3}(?<contentURL>.+)\/preview/;
            const regexResult = regex.exec(path);
            const contentURL = regexResult.groups.contentURL;
            if (contentURL === "/homepage") {
                return "/";
            }
            return contentURL;
        } catch (error) {
            notifications.add({
                type: "warning",
                message:
                    "There was an error previewing this content so you've been directed to the homepage. You can navigate to the content or refresh Florence.",
                isDismissable: true,
            });
            return "/";
        }
    };

    render() {
        this.getPreviewIframeURL(this.props.location.pathname);
        return (
            <div>
                <div className="grid grid--justify-center">
                    <div className="grid__col-6 margin-bottom--1">
                        <div className="margin-top--2">
                            &#9664;{" "}
                            <button type="button" className="btn btn--link" onClick={this.handleBackButton}>
                                Back
                            </button>
                        </div>
                        <h1 className="margin-top--1 margin-bottom--1">Preview</h1>
                    </div>
                </div>
                <div className="preview--half preview--borders">
                    <Iframe path={this.getPreviewIframeURL(this.props.location.pathname)} />
                </div>
                <div className="grid grid--justify-center">
                    <div className="grid__col-6">
                        <div className="margin-top--1 margin-bottom--1">
                            <Link
                                className="btn btn--positive margin-right--1"
                                to={window.location.origin + "/florence/collections/" + this.props.params.collectionID}
                            >
                                Continue
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

WorkflowPreview.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        enableCantabularJourney: state.state.config.enableCantabularJourney,
    };
}

export default connect(mapStateToProps)(WorkflowPreview);
