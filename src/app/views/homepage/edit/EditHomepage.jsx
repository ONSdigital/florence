import React, { Component } from "react";
import PropTypes from "prop-types";
import SimpleEditableList from "../../../components/simple-editable-list/SimpleEditableList";
import SaveAndReviewActions from "../../../components/save-and-review-actions/SaveAndReviewActions";
import Input from "../../../components/Input";

import { connect } from "react-redux";

class EditHomepage extends Component {
    render() {
        return (
            <div className="grid__col-6 margin-bottom--4">
                <div className="margin-top--2">
                    &#9664;{" "}
                    <button type="button" className="btn btn--link" onClick={this.props.handleBackButton}>
                        Back
                    </button>
                </div>
                <h1 className="margin-top--1 margin-bottom--1">Edit Homepage</h1>
                <h2 className="margin-top--0">Headlines</h2>
                <SimpleEditableList
                    addText={"Add headline"}
                    fields={this.props.homepageData.featuredContent}
                    editingStateFieldName="featuredContent"
                    handleAddClick={this.props.handleSimpleEditableListAdd}
                    handleEditClick={this.props.handleSimpleEditableListEdit}
                    handleDeleteClick={this.props.handleSimpleEditableListDelete}
                    maximumNumberOfEntries={this.props.maximumNumberOfEntries}
                    disableActions={this.props.disableForm}
                />
                <h2 className="margin-top--1">Around ONS</h2>
                <SimpleEditableList
                    addText={"Add around ONS feature"}
                    fields={this.props.homepageData.aroundONS}
                    editingStateFieldName="aroundONS"
                    handleAddClick={this.props.handleSimpleEditableListAdd}
                    handleEditClick={this.props.handleSimpleEditableListEdit}
                    handleDeleteClick={this.props.handleSimpleEditableListDelete}
                    maximumNumberOfEntries={this.props.maximumNumberOfEntries}
                    disableActions={this.props.disableForm}
                />
                <h2 className="margin-top--1">Service Message</h2>
                <Input
                    id="serviceMessage"
                    label=""
                    type="textarea"
                    value={this.props.homepageData.serviceMessage}
                    onChange={this.props.handleStringInputChange}
                    disabled={this.props.disableForm}
                />
                <div className="margin-top--2">
                    <button
                        type="button"
                        className="btn btn--primary margin-right--1"
                        onClick={this.props.handleSaveAndPreview}
                        disabled={this.props.disableForm}
                    >
                        Save and preview
                    </button>
                    <SaveAndReviewActions
                        disabled={this.props.disableForm}
                        reviewState={this.props.collectionState}
                        notInCollectionYet={!this.props.collectionState}
                        userEmail={this.props.userEmail}
                        lastEditedBy={this.props.lastEditedBy}
                        onApprove={this.props.handleMarkAsReviewedClick}
                        onSubmit={this.props.handleSubmitForReviewClick}
                    />
                    {this.props.isSaving && <div className="form__loader loader loader--dark margin-left--1"></div>}
                </div>
            </div>
        );
    }
}

const propTypes = {
    homepageData: PropTypes.shape({
        featuredContent: PropTypes.array,
        aroundONS: PropTypes.array,
        serviceMessage: PropTypes.string
    }),
    handleBackButton: PropTypes.func.isRequired,
    handleSimpleEditableListAdd: PropTypes.func.isRequired,
    handleSimpleEditableListDelete: PropTypes.func.isRequired,
    handleSimpleEditableListEdit: PropTypes.func.isRequired,
    handleStringInputChange: PropTypes.func.isRequired,
    handleSaveAndPreview: PropTypes.func.isRequired,
    handleSubmitForReviewClick: PropTypes.func.isRequired,
    handleMarkAsReviewedClick: PropTypes.func.isRequired,
    collectionState: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    lastEditedBy: PropTypes.string,
    maximumNumberOfEntries: PropTypes.number,
    disableForm: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired
};

EditHomepage.propTypes = propTypes;

export default EditHomepage;
