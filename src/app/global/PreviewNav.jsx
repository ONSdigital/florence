import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import { updateSelectedPreviewPage } from "../config/actions";

import Select from "../components/Select";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    preview: PropTypes.object.isRequired,
    rootPath: PropTypes.string.isRequired,
    workingOn: PropTypes.object.isRequired
};

export class PreviewNav extends Component {
    constructor(props) {
        super(props);

        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    mapPagesToSelect(pages) {
        if (pages) {
            try {
                return pages.map(page => {
                    return {
                        id: page.uri,
                        name: this.createPageTitle(page)
                    };
                });
            } catch (err) {
                console.error("Error mapping pages to select", err);
            }
        }
        return;
    }

    createPageTitle(page) {
        if (page.description.title && page.description.edition) {
            return `${page.description.title}: ${page.description.edition}`;
        }
        if (!page.description.title && page.description.edition) {
            return `[no title available]: ${page.description.edition}`;
        }
        if (page.description.title && !page.description.edition) {
            return page.description.title;
        }
        return "";
    }

    handleSelectChange(event) {
        const selection = event.target.value;
        if (selection === "default-option") {
            return;
        }
        const uri = selection;
        this.props.dispatch(updateSelectedPreviewPage(uri));
        this.props.dispatch(push(`${this.props.rootPath}/collections/${this.props.workingOn.id}/preview?url=${uri}`));
    }

    render() {
        return (
            <div className="global-nav__preview-select">
                <Select
                    id="preview-select"
                    contents={this.mapPagesToSelect(this.props.preview.pages) || []}
                    onChange={this.handleSelectChange}
                    defaultOption={this.props.preview.pages ? "Select an option" : "Loading pages..."}
                    selectedOption={this.props.preview.selectedPage || ""}
                />
            </div>
        );
    }
}

PreviewNav.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        preview: state.state.preview,
        rootPath: state.state.rootPath,
        workingOn: state.state.global.workingOn || {}
    };
}

export default connect(mapStateToProps)(PreviewNav);
