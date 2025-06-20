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
import Popouts from "../../../components/popouts/Popouts";

const propTypes = {
    metadata: PropTypes.shape({
        title: PropTypes.string,
        summary: PropTypes.string,
        keywords: PropTypes.string,
        nationalStatistic: PropTypes.bool,
        licence: PropTypes.string,
        contactName: PropTypes.string,
        contactEmail: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        contactTelephone: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        relatedDatasets: PropTypes.array,
        relatedContent: PropTypes.array,
        relatedPublications: PropTypes.array,
        relatedMethodologies: PropTypes.array,
        releaseFrequency: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.number,
        releaseDate: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string,
        }),
        nextReleaseDate: PropTypes.string,
        unitOfMeasure: PropTypes.string,
        notices: PropTypes.array,
        dimensions: PropTypes.array,
        qmi: PropTypes.string,
        latestChanges: PropTypes.array,
        usageNotes: PropTypes.array,
        canonicalTopic: PropTypes.object,
        secondaryTopics: PropTypes.array,
        census: PropTypes.bool,
    }).isRequired,
    fieldsReturned: PropTypes.shape({
        title: PropTypes.bool,
        summary: PropTypes.bool,
        keywords: PropTypes.bool,
        contactName: PropTypes.bool,
        contactEmail: PropTypes.bool,
        contactTelephone: PropTypes.bool,
        unitOfMeasure: PropTypes.bool,
        dimensions: PropTypes.bool,
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
    canonicalTopicsMenuArr: PropTypes.array.isRequired,
    secondaryTopicsMenuArr: PropTypes.array.isRequired,
    handleCanonicalTopicTagFieldChange: PropTypes.func.isRequired,
    handleSecondaryTopicTagsFieldChange: PropTypes.func.isRequired,
    canonicalTopicErr: PropTypes.string,
    secondaryTopicErr: PropTypes.string,
    handleCensusContentChange: PropTypes.func.isRequired,
    refreshCantabularMetadataState: PropTypes.object.isRequired,
    handleCantabularMetadataUpdate: PropTypes.func.isRequired,
    hideUpdateCantabularMetadataPopout: PropTypes.func.isRequired,
    handleRevertChangesButton: PropTypes.func.isRequired,
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
    canonicalTopicsMenuArr,
    secondaryTopicsMenuArr,
    handleCanonicalTopicTagFieldChange,
    handleSecondaryTopicTagsFieldChange,
    canonicalTopicErr,
    secondaryTopicErr,
    handleCensusContentChange,
    refreshCantabularMetadataState,
    handleCantabularMetadataUpdate,
    hideUpdateCantabularMetadataPopout,
    handleRevertChangesButton,
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

            {refreshCantabularMetadataState.showUpdateCantabularMetadataPopout && (
                <Popouts
                    popouts={[
                        {
                            id: "updateCantabularMetadataPopout",
                            title: "This dataset has new changes. Would you like to import the latest version ?",
                            buttons: [
                                { text: "View changes first", style: "primary", onClick: handleCantabularMetadataUpdate },
                                { text: "No", style: "invert-primary", onClick: hideUpdateCantabularMetadataPopout },
                            ],
                        },
                    ]}
                />
            )}

            <h2>Title</h2>
            <Input
                id="title"
                value={metadata.title}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.title}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.hasOwnProperty("title")
                }
            />

            <h2 id="release-dates-heading">Release dates</h2>
            <Input
                id="release-date"
                name="releaseDate"
                label="Release date"
                type="date"
                onChange={handleDateInputChange}
                value={metadata.releaseDate.value && date.format(metadata.releaseDate.value, "yyyy-mm-dd")}
                disabled={disableForm || versionIsPublished}
                error={metadata.releaseDate.error}
                requiredFieldMessage={!metadata.releaseDate.value ? "Required field" : ""}
            />

            <Input
                id="next-release"
                name="nextReleaseDate"
                label="Next release date"
                onChange={handleStringInputChange}
                value={metadata.nextReleaseDate}
                disabled={disableForm}
            />

            <Input
                id="release-frequency"
                name="releaseFrequency"
                label="Release frequency"
                onChange={handleStringInputChange}
                value={metadata.releaseFrequency}
                disabled={disableForm}
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
                disableActions={disableForm}
            />

            <h2 className="margin-top--1">About</h2>
            <Input
                id="summary"
                label="Summary"
                type="textarea"
                value={metadata.summary}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.summary}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.hasOwnProperty("description")
                }
            />

            <Input
                id="unit-of-measure"
                name="unitOfMeasure"
                label="Unit of measure"
                type="input"
                value={metadata.unitOfMeasure}
                onChange={handleStringInputChange}
                disabled={disableForm || fieldsReturned.unitOfMeasure}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.hasOwnProperty("unit_of_measure")
                }
            />

            <h2>Dimensions</h2>
            {metadata.dimensions.map((dimension, i) => {
                let getUpdatedDimensionObj = refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.version?.dimensions?.find(
                    updatedDimensionObj => updatedDimensionObj?.id === dimension?.id
                );
                return (
                    <div key={`dimension-${dimension.id}`}>
                        <Input
                            id={`dimension-title-${dimension.id}`}
                            label="Title"
                            value={dimension.label ? dimension.label : dimension.name}
                            onChange={handleDimensionNameChange}
                            disabled={disableForm || versionIsPublished || fieldsReturned.dimensions}
                            highlightField={
                                refreshCantabularMetadataState.highlightCantabularMetadataChanges && getUpdatedDimensionObj?.hasOwnProperty("label")
                            }
                        />
                        <Input
                            id={`dimension-description-${dimension.id}`}
                            label="Description"
                            type="textarea"
                            value={dimension.description}
                            onChange={handleDimensionDescriptionChange}
                            disabled={disableForm || versionIsPublished || fieldsReturned.dimensions}
                            inline={true}
                            highlightField={
                                refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                                getUpdatedDimensionObj?.hasOwnProperty("description")
                            }
                        />
                        <h3>Quality statement</h3>
                        <Input
                            id={`dimension-quality-statement-text-${dimension.id}`}
                            label="Text"
                            value={dimension.quality_statement_text || ""}
                            onChange={handleDimensionNameChange}
                            disabled={true}
                            highlightField={
                                refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                                getUpdatedDimensionObj?.hasOwnProperty("quality_statement_text")
                            }
                        />
                        <Input
                            id={`dimension-quality-statement-url-${dimension.id}`}
                            label="URL"
                            value={dimension.quality_statement_url || ""}
                            onChange={handleDimensionNameChange}
                            disabled={true}
                            highlightField={
                                refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                                getUpdatedDimensionObj?.hasOwnProperty("quality_statement_url")
                            }
                        />
                        {i < metadata.dimensions.length - 1 && <hr className="margin-bottom--1 element-divider" />}
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
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.hasOwnProperty("keywords")
                }
            />

            <Input id="licence" label="Licence" onChange={handleStringInputChange} value={metadata.licence} disabled={disableForm} />

            <h3>Usage notes</h3>
            <div className="margin-bottom--1">
                <SimpleEditableList
                    addText={"Add a usage note"}
                    fields={metadata.usageNotes}
                    editingStateFieldName="usageNotes"
                    handleAddClick={handleSimpleEditableListAdd}
                    handleEditClick={handleSimpleEditableListEdit}
                    handleDeleteClick={handleSimpleEditableListDelete}
                    disableActions={disableForm}
                />
            </div>

            <RadioGroup
                groupName="nationalStatistic"
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
                legend={"Accredited official statistics"}
                disabled={disableForm}
            />

            <RadioGroup
                groupName="census"
                radioData={[
                    {
                        id: "census-content-yes",
                        value: "true",
                        label: "Yes",
                    },
                    {
                        id: "census-content-no",
                        value: "false",
                        label: "No",
                    },
                ]}
                selectedValue={metadata.census ? metadata.census.toString() : "false"}
                onChange={handleCensusContentChange}
                inline={true}
                legend={"Census content"}
                disabled={disableForm}
            />

            <h2 id="contact-details-heading">Contact details</h2>
            <Input
                id="contact-name"
                name="contactName"
                label="Contact name"
                onChange={handleStringInputChange}
                value={metadata.contactName}
                disabled={disableForm || fieldsReturned.contactName}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.contacts?.[0].hasOwnProperty("name")
                }
            />

            <Input
                id="contact-email"
                name="contactEmail"
                label="Contact email"
                onChange={handleStringInputChange}
                value={metadata.contactEmail.value}
                disabled={disableForm || fieldsReturned.contactEmail}
                error={metadata.contactEmail.error}
                requiredFieldMessage={!metadata.contactEmail.value ? "Required field" : ""}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.contacts?.[0].hasOwnProperty("email")
                }
            />

            <Input
                id="contact-telephone"
                name="contactTelephone"
                label="Contact telephone"
                onChange={handleStringInputChange}
                value={metadata.contactTelephone.value}
                disabled={disableForm || fieldsReturned.contactTelephone}
                error={metadata.contactTelephone.error}
                requiredFieldMessage={!metadata.contactTelephone.value ? "Required field" : ""}
                highlightField={
                    refreshCantabularMetadataState.highlightCantabularMetadataChanges &&
                    refreshCantabularMetadataState.cantabularMetadataUpdatedFields?.dataset?.contacts?.[0].hasOwnProperty("telephone")
                }
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
                disableActions={disableForm}
            />

            <h3 className="margin-top--1">Bulletins, articles and compendia</h3>
            <SimpleEditableList
                addText={"Add a publication"}
                fields={metadata.relatedPublications}
                editingStateFieldName="relatedPublications"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm}
            />
            <h3 className="margin-top--1">Quality and methodology information</h3>
            <Input id="qmi" label="QMI URL" onChange={handleStringInputChange} value={metadata.qmi} disabled={disableForm} />
            <h3>Methodologies</h3>
            <SimpleEditableList
                addText={"Add a methodology"}
                fields={metadata.relatedMethodologies}
                editingStateFieldName="relatedMethodologies"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm}
            />
            <h3 className="margin-top--1">Related content</h3>
            <SimpleEditableList
                addText={"Add related content"}
                fields={metadata.relatedContent}
                editingStateFieldName="relatedContent"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm}
            />

            <h2 className="margin-top--1">What's changed</h2>
            <SimpleEditableList
                addText={"Add a change"}
                fields={metadata.latestChanges}
                editingStateFieldName="latestChanges"
                handleAddClick={handleSimpleEditableListAdd}
                handleEditClick={handleSimpleEditableListEdit}
                handleDeleteClick={handleSimpleEditableListDelete}
                disableActions={disableForm || versionIsPublished}
            />

            <h2 className="margin-top--1 margin-bottom--1" id="topic-tags-heading">
                Topic tags
            </h2>

            <SelectTags
                singleDefaultValue={Object.keys(metadata.canonicalTopic).length ? metadata.canonicalTopic : null}
                id="canonicalTopic"
                label="Canonical topic"
                contents={canonicalTopicsMenuArr}
                handleChange={handleCanonicalTopicTagFieldChange}
                multipleSelection={false}
                error={canonicalTopicErr}
                disabled={disableForm}
            />
            <SelectTags
                id="secondaryTopics"
                label="Secondary topics"
                contents={secondaryTopicsMenuArr}
                handleChange={handleSecondaryTopicTagsFieldChange}
                multiDefaultValue={metadata.secondaryTopics}
                multipleSelection={true}
                error={secondaryTopicErr}
                disabled={disableForm}
            />

            <div className="margin-top--2">
                <button type="button" className="btn btn--primary margin-right--1" onClick={handleSave} disabled={disableForm}>
                    Save
                </button>
                {refreshCantabularMetadataState.showRevertChangesButton && (
                    <button disabled={disableForm} type="button" className="btn btn--warning margin-right--1" onClick={handleRevertChangesButton}>
                        Revert to original
                    </button>
                )}

                <SaveAndReviewActions
                    disabled={disableForm}
                    reviewState={collectionState}
                    notInCollectionYet={!collectionState}
                    userEmail={userEmail}
                    lastEditedBy={lastEditedBy}
                    onSubmit={handleSubmitForReviewClick}
                    onApprove={handleMarkAsReviewedClick}
                />
                <button disabled={disableCancel} type="button" className="btn btn--invert-primary margin-right--1" onClick={handleRedirectOnReject}>
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
