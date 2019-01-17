import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import date from '../../../utilities/date'

import Input from '../../../components/Input';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';
import SimpleEditableList from '../../../components/simple-editable-list/SimpleEditableList';
import DatasetReviewActions from './DatasetReviewActions';

const propTypes = {
    metadata: PropTypes.shape({
        title: PropTypes.string,
        summary: PropTypes.string,
        keywords: PropTypes.array,
        nationalStatistic: PropTypes.bool,
        licence: PropTypes.string,
        contactName: PropTypes.string,
        contactEmail: PropTypes.string,
        contactTelephone: PropTypes.string,
        relatedDatasets: PropTypes.array,
        relatedPublications: PropTypes.array,
        relatedMethodologies: PropTypes.array,
        releaseFrequency: PropTypes.string,
        edition: PropTypes.string,
        version: PropTypes.number,
        releaseDate: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string
        }),
        nextReleaseDate: PropTypes.shape({
            value: PropTypes.string,
            error: PropTypes.string
        }),
        unitOfMeasure: PropTypes.string,
        notices: PropTypes.array,
        dimensions: PropTypes.array,
        qmi: PropTypes.string,
        latestChanges: PropTypes.array,
        usageNotes: PropTypes.array
    }).isRequired,
    handleBackButton: PropTypes.func.isRequired,
    handleDateInputChange: PropTypes.func.isRequired,
    handleStringInputChange: PropTypes.func.isRequired,
    handleDimensionNameChange: PropTypes.func.isRequired,
    handleDimensionDescriptionChange: PropTypes.func.isRequired,
    handleNationalStaticticChange: PropTypes.func.isRequired,
    handleSimpleEditableListAdd: PropTypes.func.isRequired,
    handleSimpleEditableListDelete: PropTypes.func.isRequired,
    handleSimpleEditableListEdit: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    versionIsPublished: PropTypes.bool.isRequired,
    datasetCollectionState: PropTypes.string,
    userEmail: PropTypes.string.isRequired,
    lastEditedBy: PropTypes.string.isRequired,
    handleSubmitForReviewClick: PropTypes.func.isRequired,
    handleMarkAsReviewedClick: PropTypes.func.isRequired,
    disableForm: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool
}

class DatasetMetadata extends Component {
    render() {
        return (
            <div className="grid__col-6 margin-bottom--4">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.props.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Edit metadata</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.props.metadata.title ? this.props.metadata.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.props.metadata.edition ? this.props.metadata.edition : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.props.metadata.version ? this.props.metadata.version : "loading..."}</p>

                    <h2>Title</h2>
                    <Input id="title" 
                        value={this.props.metadata.title} 
                        onChange={this.props.handleStringInputChange} 
                        disabled={this.props.disableForm}
                    />

                    <h2>Release dates</h2>
                    <Input id="release-date" 
                        name="releaseDate" 
                        label="Release date" 
                        type="date" 
                        onChange={this.props.handleDateInputChange} 
                        value={this.props.metadata.releaseDate.value && date.format(this.props.metadata.releaseDate.value, "yyyy-mm-dd")} 
                        disabled={this.props.disableForm || this.props.versionIsPublished}
                        error={this.props.metadata.releaseDate.error}
                    />

                    <Input id="next-release" 
                        name="nextReleaseDate" 
                        label="Next release date" 
                        type="date" 
                        onChange={this.props.handleDateInputChange} 
                        value={this.props.metadata.nextReleaseDate.value && date.format(this.props.metadata.nextReleaseDate.value, "yyyy-mm-dd")} 
                        disabled={this.props.disableForm}
                        error={this.props.metadata.nextReleaseDate.error}
                    />

                    <Input id="release-frequency" 
                        name="releaseFrequency" 
                        label="Release frequency" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.releaseFrequency} 
                        disabled={this.props.disableForm}
                    />

                    <h2>Notices</h2>
                    <p className="margin-bottom--1">Add an alert, correction, change summary or usage note.</p>
                    <SimpleEditableList addText={"Add a new notice"} 
                        fields={this.props.metadata.notices} 
                        editingStateFieldName="notices"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.disableForm}
                    />
                    
                    <h2 className="margin-top--1">About</h2>
                    <Input id="summary" 
                        label="Summary" type="textarea" 
                        value={this.props.metadata.summary} 
                        onChange={this.props.handleStringInputChange} 
                        disabled={this.props.disableForm}
                    />

                    <Input id="unit-of-measure" 
                        name="unit" 
                        label="Unit of measure" 
                        type="input" 
                        value={this.props.metadata.unitOfMeasure} 
                        onChange={this.props.handleStringInputChange} 
                        disabled={this.props.disableForm}
                    />

                    <h2>Dimensions</h2>
                    {this.props.metadata.dimensions.map(dimension => {
                        return (
                            <div key={`dimension-${dimension.id}`}>
                                <Input id={`dimension-title-${dimension.id}`} 
                                    label="Title" 
                                    value={dimension.name} 
                                    onChange={this.props.handleDimensionNameChange} 
                                    disabled={this.props.disableForm || this.props.versionIsPublished}
                                />
                                <Input id={`dimension-description-${dimension.id}`} 
                                    label="Description" 
                                    type="textarea" 
                                    value={dimension.description} 
                                    onChange={this.props.handleDimensionDescriptionChange} 
                                    disabled={this.props.disableForm || this.props.versionIsPublished}
                                />
                            </div>
                        )
                    })} 

                    <h2>Meta</h2>
                    <Input id="keywords" 
                        label="Keywords" 
                        value={this.props.metadata.keywords ? this.props.metadata.keywords.join(", ") : ""} 
                        disabled={this.props.disableForm}
                    />

                    <Input id="licence" 
                        label="Licence" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.licence} 
                        disabled={this.props.disableForm}
                    />

                    <h3>Usage notes</h3>
                    <div className="margin-bottom--1">
                        <SimpleEditableList addText={"Add a usage note"} 
                            fields={this.props.metadata.usageNotes} 
                            editingStateFieldName="usageNotes"
                            handleAddClick={this.props.handleSimpleEditableListAdd}
                            handleEditClick={this.props.handleSimpleEditableListEdit}
                            handleDeleteClick={this.props.handleSimpleEditableListDelete}
                            disableActions={this.props.disableForm}
                        />
                    </div>

                    <RadioGroup groupName="national-statistic" 
                        radioData={[
                            {id: "national-statistic-yes", value: "true", label: "Yes"},
                            {id: "national-statistic-no", value: "false", label: "No"}]}
                        selectedValue={this.props.metadata.nationalStatistic ? this.props.metadata.nationalStatistic.toString() : "false"}
                        onChange={this.props.handleNationalStaticticChange}
                        inline={true}
                        legend={"National Statistic"}
                        disabled={this.props.disableForm}
                    /> 

                    <h2>Contact details</h2>
                    <Input id="contact-name" 
                        name="contactName" 
                        label="Contact name" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.contactName} 
                        disabled={this.props.disableForm}
                    />

                    <Input id="contact-email" 
                        name="contactEmail" 
                        label="Contact email" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.contactEmail} 
                        disabled={this.props.disableForm}
                    />

                    <Input id="contact-telephone" 
                        name="contactTelephone" 
                        label="Contact telephone" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.contactTelephone} 
                        disabled={this.props.disableForm}
                    />

                    <h2>Related links</h2>
                    <h3>Datasts</h3>
                    <SimpleEditableList addText={"Add a dataset"} 
                        fields={this.props.metadata.relatedDatasets} 
                        editingStateFieldName="relatedDatasets"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.disableForm}
                    />

                    <h3 className="margin-top--1">Bulletins, articles and compendia</h3>
                    <SimpleEditableList addText={"Add a publication"} 
                        fields={this.props.metadata.relatedPublications} 
                        editingStateFieldName="relatedPublications"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.disableForm}
                    />

                    <h3 className="margin-top--1">Quality and methodology information</h3>
                    <Input id="qmi" 
                        label="QMI URL" 
                        onChange={this.props.handleStringInputChange} 
                        value={this.props.metadata.qmi} 
                        disabled={this.props.disableForm}
                    />

                    <h3>Methodologies</h3>
                    <SimpleEditableList addText={"Add a methodology"} 
                        fields={this.props.metadata.relatedMethodologies} 
                        editingStateFieldName="relatedMethodologies"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.disableForm}
                    />

                    <h2 className="margin-top--1">What's changed</h2>
                    <SimpleEditableList addText={"Add a change"} 
                        fields={this.props.metadata.latestChanges} 
                        editingStateFieldName="latestChanges"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.disableForm}
                    />

                    <div className="margin-top--2">
                        <button type="button" 
                            className="btn btn--primary margin-right--1" 
                            onClick={this.props.handleSave} 
                            disabled={this.props.disableForm}>Save
                        </button>
                        <DatasetReviewActions 
                            disabled={this.props.disableForm}
                            reviewState={this.props.datasetCollectionState}
                            userEmail={this.props.userEmail}
                            lastEditedBy={this.props.lastEditedBy}
                            onSubmit={this.props.handleSubmitForReviewClick}
                            onApprove={this.props.handleMarkAsReviewedClick}
                        />
                        <Link to={`${window.location.pathname}/preview`}>Preview</Link>
                        {this.props.isSaving && <div className="form__loader loader loader--dark margin-left--1"></div>}
                    </div>
                </div>
        );
    }
}

DatasetMetadata.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        userEmail: state.state.user.email
    }
}

export default connect(mapStateToProps)(DatasetMetadata);