import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from "react-redux";

import date from "../../../utilities/date";

import Input from "../../../components/Input";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import SimpleEditableList from "../../../components/simple-editable-list/SimpleEditableList";
import SaveAndReviewActions from "../../../components/save-and-review-actions/SaveAndReviewActions";
import SelectTags from "../../../components/select-tags/Select-tags";

const propTypes = {
    metadata: PropTypes.shape({
        title: PropTypes.string,
        summary: PropTypes.string,
        keywords: PropTypes.string,
        nationalStatistic: PropTypes.bool,
        licence: PropTypes.string,
        contactName: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        contactEmail: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        contactTelephone: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        relatedDatasets: PropTypes.array,
        relatedPublications: PropTypes.array,
        relatedMethodologies: PropTypes.array,
        releaseFrequency: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        edition: PropTypes.string,
        version: PropTypes.number,
        releaseDate: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        nextReleaseDate: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        unitOfMeasure: PropTypes.string,
        notices: PropTypes.array,
        dimensions: PropTypes.array,
        qmi: PropTypes.string,
        latestChanges: PropTypes.array,
        usageNotes: PropTypes.array,
        primaryTopic: PropTypes.string,
        secondaryTopics: PropTypes.array,
    }).isRequired,
    fieldsReturned: PropTypes.shape({
        title: PropTypes.bool,
        summary: PropTypes.bool,
        keywords: PropTypes.bool,
        nationalStatistic: PropTypes.bool,
        licence: PropTypes.bool,
        contactName: PropTypes.bool,
        contactEmail: PropTypes.bool,
        contactTelephone: PropTypes.bool,
        relatedDatasets: PropTypes.bool,
        relatedPublications: PropTypes.bool,
        relatedMethodologies: PropTypes.bool,
        releaseFrequency: PropTypes.bool,
        releaseDate: PropTypes.bool,
        nextReleaseDate: PropTypes.bool,
        unitOfMeasure: PropTypes.bool,
        notices: PropTypes.bool,
        dimensions: PropTypes.bool,
        qmi: PropTypes.bool,
        latestChanges: PropTypes.bool,
        usageNotes: PropTypes.bool,
    }).isRequired,
    handleBackButton: PropTypes.func.isRequired,
    handleDateInputChange: PropTypes.func.isRequired,
    handleStringInputChange: PropTypes.func.isRequired,
    handleDimensionNameChange: PropTypes.func.isRequired,
    handleDimensionDescriptionChange: PropTypes.func.isRequired,
    handleNationalStatisticChange: PropTypes.func.isRequired,
    handleSimpleEditableListAdd: PropTypes.func.isRequired,
    handleSimpleEditableListDelete: PropTypes.func.isRequired,
    handleSimpleEditableListEdit: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    allowPreview: PropTypes.bool.isRequired,
    versionIsPublished: PropTypes.bool.isRequired,
    collectionState: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    lastEditedBy: PropTypes.string,
    handleSubmitForReviewClick: PropTypes.func.isRequired,
    handleMarkAsReviewedClick: PropTypes.func.isRequired,
    handleRedirectOnReject: PropTypes.func.isRequired,
    disableForm: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool,
    disableCancel: PropTypes.bool,
    primaryTopicsMenuArr: PropTypes.array.isRequired,
    secondaryTopicsMenuArr: PropTypes.array.isRequired,
    handlePrimaryTopicTagFieldChange: PropTypes.func.isRequired,
    handleSecondaryTopicTagsFieldChange: PropTypes.func.isRequired,
    topicsErr: PropTypes.string,
};

const CantabularMetadata = ({
    handleBackButton,
    metadata,
    handleStringInputChange,
    disableForm,
    handleDateInputChange,
    versionIsPublished,
    handleSimpleEditableListAdd,
    handleSimpleEditableListEdit,
    handleSimpleEditableListDelete,
    handleDimensionNameChange,
    handleDimensionDescriptionChange,
    handleNationalStatisticChange,
    handleSave,
    collectionState,
    userEmail,
    lastEditedBy,
    handleSubmitForReviewClick,
    handleMarkAsReviewedClick,
    handleRedirectOnReject,
    isSaving,
    allowPreview,
    disableCancel,
    fieldsReturned,
    primaryTopicsMenuArr,
    secondaryTopicsMenuArr,
    handlePrimaryTopicTagFieldChange,
    handleSecondaryTopicTagsFieldChange,
    topicsErr,
}) => {
    return (
        <div className="grid__col-6 margin-bottom--8">
            <div className="margin-top--2">
                &#9664;{" "}
                <button type="button" className="btn btn--link" onClick={handleBackButton}>
                    Back
                </button>
            </div>
            <h1 className="margin-top--1 margin-bottom--1">Edit metadata (Cantabular)</h1>
            <p className="margin-bottom--1 font-size--18">
                <span className="font-weight--600">Dataset</span>: {metadata.title ? metadata.title : "loading..."}
            </p>
            <p className="margin-bottom--1 font-size--18">
                <span className="font-weight--600">Edition</span>: {metadata.edition ? metadata.edition : "loading..."}
            </p>
            <p className="margin-bottom--1 font-size--18">
                <span className="font-weight--600">Version</span>: {metadata.version ? metadata.version : "loading..."}
            </p>

            <h2>Title</h2>
            <Input id="title" value={metadata.title} onChange={handleStringInputChange} disabled={disableForm || fieldsReturned.title} />

            <h2 id="release-dates-heading">Release dates</h2>
            <Input
                id="release-date"
                name="releaseDate"
                label="Release date"
                type="date"
                onChange={handleDateInputChange}
                value={metadata.releaseDate.value && date.format(metadata.releaseDate.value, "yyyy-mm-dd")}
                disabled={disableForm || versionIsPublished || fieldsReturned.releaseDate}
                error={metadata.releaseDate.error}
            />

            <Input
                id="next-release"
                name="nextReleaseDate"
                label="Next release date"
                onChange={handleStringInputChange}
                value={metadata.nextReleaseDate.value}
                error={metadata.nextReleaseDate.error}
                disabled={disableForm || fieldsReturned.nextReleaseDate}
            />

            <Input
                id="release-frequency"
                name="releaseFrequency"
                label="Release frequency"
                onChange={handleStringInputChange}
                value={metadata.releaseFrequency.value}
                disabled={disableForm || fieldsReturned.releaseFrequency}
                error={metadata.releaseFrequency.error}
            />

            <h2>Notices</h2>
            <p className="margin-bottom--1">Add an alert, correction, change summary or usage note.</p>
            <SimpleEditableList
                addText={"Add a new notice"}
                fields={metadata.notices}
                editingStateFieldName="notices"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || fieldsReturned.notices}
            />

            <h2 className="margin-top--1">About</h2>
            <Input
                id="summary"
                label="Summary"
                type="textarea"
                value={metadata.summary}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.summary}
            />

            <Input
                id="unit-of-measure"
                name="unitOfMeasure"
                label="Unit of measure"
                type="input"
                value={metadata.unitOfMeasure}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.unitOfMeasure}
            />

            <h2>Dimensions</h2>
            {metadata.dimensions.map(dimension => {
                return (
                    <div key={`dimension-${dimension.id}`}>
                        <Input
                            id={`dimension-title-${dimension.id}`}
                            label="Title"
                            value={dimension.label ? dimension.label : dimension.name}
                            onChange={handleDimensionNameChange}
                            disabled={disableForm || versionIsPublished || fieldsReturned.dimensions}
                        />
                        <Input
                            id={`dimension-description-${dimension.id}`}
                            label="Description"
                            type="textarea"
                            value={dimension.description}
                            onChange={handleDimensionDescriptionChange}
                            disabled={disableForm || versionIsPublished || fieldsReturned.dimensions}
                        />
                    </div>
                );
            })}

            <h2>Meta</h2>
            <Input
                id="keywords"
                label="Keywords"
                value={metadata.keywords}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.keywords}
            />

            <Input
                id="licence"
                label="Licence"
                onChange={handleStringInputChange}
                value={metadata.licence}
                disabled={disableForm || fieldsReturned.licence}
            />

            <h3>Usage notes</h3>
            <div className="margin-bottom--1">
                <SimpleEditableList
                    addText={"Add a usage note"}
                    fields={metadata.usageNotes}
                    editingStateFieldName="usageNotes"
                    handleAddClick={handleSimpleEditableListAdd}
                    handleEditClick={handleSimpleEditableListEdit}
                    handleDeleteClick={handleSimpleEditableListDelete}
                    disableActions={disableForm || fieldsReturned.usageNotes}
                />
            </div>

            <RadioGroup
                groupName="national-statistic"
                radioData={[
                    {
                        id: "national-statistic-yes",
                        value: "true",
                        label: "Yes",
                    },
                    {
                        id: "national-statistic-no",
                        value: "false",
                        label: "No",
                    },
                ]}
                selectedValue={metadata.nationalStatistic ? metadata.nationalStatistic.toString() : "false"}
                onChange={handleNationalStatisticChange}
                inline={true}
                legend={"National Statistic"}
                disabled={disableForm || fieldsReturned.nationalStatistic}
            />
            <h2 id="contact-details-heading">Contact details</h2>
            <Input
                id="contact-name"
                name="contactName"
                label="Contact name"
                onChange={handleStringInputChange}
                value={metadata.contactName.value}
                disabled={disableForm || fieldsReturned.contactName}
                error={metadata.contactName.error}
            />
            <Input
                id="contact-email"
                name="contactEmail"
                label="Contact email"
                onChange={handleStringInputChange}
                value={metadata.contactEmail.value}
                disabled={disableForm || fieldsReturned.contactEmail}
                error={metadata.contactEmail.error}
            />

            <Input
                id="contact-telephone"
                name="contactTelephone"
                label="Contact telephone"
                onChange={handleStringInputChange}
                value={metadata.contactTelephone.value}
                disabled={disableForm || fieldsReturned.contactTelephone}
                error={metadata.contactTelephone.error}
            />

            <h2>Related links</h2>
            <h3>Datasets</h3>
            <SimpleEditableList
                addText={"Add a dataset"}
                fields={metadata.relatedDatasets}
                editingStateFieldName="relatedDatasets"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || fieldsReturned.relatedDatasets}
            />

            <h3 className="margin-top--1">Bulletins, articles and compendia</h3>
            <SimpleEditableList
                addText={"Add a publication"}
                fields={metadata.relatedPublications}
                editingStateFieldName="relatedPublications"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || fieldsReturned.relatedPublications}
            />
            <h3 className="margin-top--1">Quality and methodology information</h3>
            <Input id="qmi" label="QMI URL" onChange={handleStringInputChange} value={metadata.qmi} disabled={disableForm || fieldsReturned.qmi} />
            <h3>Methodologies</h3>
            <SimpleEditableList
                addText={"Add a methodology"}
                fields={metadata.relatedMethodologies}
                editingStateFieldName="relatedMethodologies"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || fieldsReturned.relatedMethodologies}
            />

            <h2 className="margin-top--1">What's changed</h2>
            <SimpleEditableList
                addText={"Add a change"}
                fields={metadata.latestChanges}
                editingStateFieldName="latestChanges"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || versionIsPublished || fieldsReturned.latestChanges}
            />

            <h2 className="margin-top--1 margin-bottom--1" id="topic-tags-heading">
                Topic tags
            </h2>

            <SelectTags
                singleDefaultValue={metadata.primaryTopic}
                id="primaryTopic"
                label="Primary Topic"
                contents={primaryTopicsMenuArr}
                handleChange={handlePrimaryTopicTagFieldChange}
                multipleSelection={false}
                error={topicsErr}
            />
            <SelectTags
                id="secondaryTopics"
                label="Secondary Topics"
                contents={secondaryTopicsMenuArr}
                handleChange={handleSecondaryTopicTagsFieldChange}
                multiDefaultValue={metadata.secondaryTopics}
                multipleSelection={true}
                error={topicsErr}
            />

            <div className="margin-top--2">
                <button type="button" className="btn btn--primary margin-right--1" onClick={handleSave} disabled={disableForm}>
                    Save
                </button>
                <SaveAndReviewActions
                    disabled={disableForm}
                    reviewState={collectionState}
                    notInCollectionYet={!collectionState}
                    userEmail={userEmail}
                    lastEditedBy={lastEditedBy}
                    onSubmit={handleSubmitForReviewClick}
                    onApprove={handleMarkAsReviewedClick}
                />
                <button disabled={disableCancel} type="button" className="btn btn--primary margin-right--1" onClick={handleRedirectOnReject}>
                    Cancel
                </button>
                {allowPreview ? (
                    <Link to={`${window.location.pathname.replace("/cantabular", "")}/preview`}>Preview</Link>
                ) : (
                    <span>Preview is not available</span>
                )}
                {isSaving && <div className="form__loader loader loader--dark margin-left--1"></div>}
            </div>
        </div>
    );
};

CantabularMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        userEmail: state.user.email,
    };
}

export default connect(mapStateToProps)(CantabularMetadata);
