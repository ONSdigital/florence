"use strict";
import React from "react";
import PropTypes from "prop-types";
import SimpleEditableList from "../../../components/simple-editable-list/SimpleEditableList";
import SaveAndReviewActions from "../../../components/save-and-review-actions/SaveAndReviewActions";
import Input from "../../../components/Input";
import { connect } from "react-redux";
import Banner from "../../../components/banner";

const EditHomepage = ({
    handleBackButton,
    homepageData,
    handleSimpleEditableListAdd,
    handleSimpleEditableListEdit,
    handleSimpleEditableListDelete,
    maximumNumberOfEntries,
    handleBannerSave,
    disableForm,
    handleStringInputChange,
    handleSaveAndPreview,
    collectionState,
    userEmail,
    lastEditedBy,
    handleMarkAsReviewedClick,
    handleSubmitForReviewClick,
    isSaving,
}) => {
    return (
        <div className="grid__col-6 margin-bottom--4">
            <div className="margin-top--2">
                &#9664;{" "}
                <button type="button" className="btn btn--link" onClick={handleBackButton}>
                    Back
                </button>
            </div>
            <h1 className="margin-top--1 margin-bottom--1">Edit Homepage</h1>
            <h2 className="margin-top--1">Headlines</h2>
            <SimpleEditableList
                addText={"Add headline"}
                fields={homepageData.featuredContent}
                editingStateFieldName="featuredContent"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                maximumNumberOfEntries={maximumNumberOfEntries}
                disableActions={disableForm}
            />
            <h2 className="margin-top--1">Around ONS</h2>
            <SimpleEditableList
                addText={"Add around ONS feature"}
                fields={homepageData.aroundONS}
                editingStateFieldName="aroundONS"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                maximumNumberOfEntries={maximumNumberOfEntries}
                disableActions={disableForm}
            />
            <h2 className="margin-top--1">Banners</h2>
            <div className="margin-right--1 margin-left--1">
                <h3 className="margin-top--1">Emergency Banner</h3>
                <p>
                    The Emergency Banner is used to display an official Government wide message on <strong>all</strong> website pages.
                </p>
                <Banner data={homepageData.emergencyBanner} handleBannerSave={handleBannerSave} />
                <h3 className="margin-top--1">Service Message Banner</h3>
                <p>
                    The Service Message is used to display ONS service related information on <strong>all</strong> website pages.
                </p>
                <Input
                    id="serviceMessage"
                    label=""
                    type="textarea"
                    value={homepageData.serviceMessage}
                    onChange={handleStringInputChange}
                    disabled={disableForm}
                />
            </div>

            <div className="margin-top--2">
                <button type="button" className="btn btn--primary margin-right--1" onClick={handleSaveAndPreview} disabled={disableForm}>
                    Save and preview
                </button>
                <SaveAndReviewActions
                    disabled={disableForm}
                    reviewState={collectionState}
                    notInCollectionYet={!collectionState}
                    userEmail={userEmail}
                    lastEditedBy={lastEditedBy}
                    onApprove={handleMarkAsReviewedClick}
                    onSubmit={handleSubmitForReviewClick}
                />
                {isSaving && <div className="form__loader loader loader--dark margin-left--1"></div>}
            </div>
        </div>
    );
};

const propTypes = {
    homepageData: PropTypes.shape({
        emergencyBanner: PropTypes.shape({
            type: PropTypes.oneOf(["notable_death", "national_emergency", "local_emergency"]),
            title: PropTypes.string,
            description: PropTypes.string,
            linkText: PropTypes.string,
            uri: PropTypes.string,
        }),
        featuredContent: PropTypes.array,
        aroundONS: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                description: PropTypes.string,
                uri: PropTypes.string,
                image: PropTypes.string,
                title: PropTypes.string,
                simpleListHeading: PropTypes.string,
                simpleListDescription: PropTypes.string,
            })
        ),
        serviceMessage: PropTypes.string,
    }),
    handleBannerSave: PropTypes.func.isRequired,
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
    isSaving: PropTypes.bool.isRequired,
};

EditHomepage.propTypes = propTypes;

export default EditHomepage;
