import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import date from '../../../utilities/date'

import Input from '../../../components/Input';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';
import SimpleEditableList from '../../../components/simple-editable-list/SimpleEditableList';

const propTypes = {

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
                    <Input id="title" value={this.props.metadata.title} onChange={this.props.handleStringInputChange} disabled={this.props.isSaving}/>

                    <h2>Release dates</h2>
                    <Input id="release-date" name="releaseDate" label="Release date" type="date" onChange={this.props.handleDateInputChange} value={this.props.metadata.releaseDate && date.format(this.props.metadata.releaseDate, "yyyy-mm-dd")} disabled={this.props.isSaving}/>
                    <Input id="next-release" name="nextReleaseDate" label="Next release date" type="date" onChange={this.props.handleDateInputChange} value={this.props.metadata.nextReleaseDate && date.format(this.props.metadata.nextReleaseDate, "yyyy-mm-dd")} disabled={this.props.isSaving}/>
                    <Input id="release-frequency" name="releaseFrequency" label="Release frequency" onChange={this.props.handleStringInputChange} value={this.props.metadata.releaseFrequency} disabled={this.props.isSaving}/>

                    <h2>Notices</h2>
                    <p className="margin-bottom--1">Add an alert, correction, change summary or usage note.</p>
                    <SimpleEditableList addText={"Add a new notice"} 
                        fields={this.props.metadata.notices} 
                        editingStateFieldName="notices"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.isSaving}
                    />
                    
                    <h2 className="margin-top--1">About</h2>
                    <Input id="summary" label="Summary" type="textarea" value={this.props.metadata.summary} onChange={this.props.handleStringInputChange} disabled={this.props.isSaving}/>
                    <Input id="unit-of-measure" name="unit" label="Unit of measure" type="input" value={this.props.metadata.unitOfMeasure} onChange={this.props.handleStringInputChange}disabled={this.props.isSaving}/>

                    <h2>Dimensions</h2>
                    {this.props.metadata.dimensions.map(dimension => {
                        return (
                            <div key={`dimension-${dimension.id}`}>
                            <Input id={`dimension-title-${dimension.id}`} data-dimension-id={dimension.id} label="Title" value={dimension.name} onChange={this.props.handleDimensionNameChange} disabled={this.props.isSaving}/>
                            <Input id={`dimension-description-${dimension.id}`} label="Description" type="textarea" value={dimension.description} onChange={this.props.handleDimensionDescriptionChange} disabled={this.props.isSaving}/>
                            </div>
                        )
                    })} 

                    <h2>Meta</h2>
                    <Input id="keywords" label="Keywords" value={this.props.metadata.keywords.join(", ")} disabled={this.props.isSaving}/>
                    <Input id="licence" label="Licence" onChange={this.props.handleStringInputChange} value={this.props.metadata.licence} disabled={this.props.isSaving}/>
                    <RadioGroup groupName="national-statistic" 
                        radioData={[
                            {id: "national-statistic-yes", value: "true", label: "Yes"},
                            {id: "national-statistic-no", value: "false", label: "No"}]}
                        selectedValue={this.props.metadata.nationalStatistic.toString()}
                        onChange={this.props.handleNationalStaticticChange}
                        inline={true}
                        legend={"National Statistic"}
                        disabled={this.props.isSaving}
                    /> 

                    <h2>Contact details</h2>
                    <Input id="contact-name" name="contactName" label="Contact name" onChange={this.props.handleStringInputChange} value={this.props.metadata.contactName} disabled={this.props.isSaving}/>
                    <Input id="contact-email" name="contactEmail" label="Contact email" onChange={this.props.handleStringInputChange} value={this.props.metadata.contactEmail} disabled={this.props.isSaving}/>
                    <Input id="contact-telephone" name="contactTelephone" label="Contact telephone" onChange={this.props.handleStringInputChange} value={this.props.metadata.contactTelephone} disabled={this.props.isSaving}/>

                    <h2>Related link</h2>
                    <SimpleEditableList addText={"Add a related link"} 
                        fields={this.props.metadata.relatedLinks} 
                        editingStateFieldName="relatedLinks"
                        handleAddClick={this.props.handleSimpleEditableListAdd}
                        handleEditClick={this.props.handleSimpleEditableListEdit}
                        handleDeleteClick={this.props.handleSimpleEditableListDelete}
                        disableActions={this.props.isSaving}
                    />

                    <div className="margin-top--2">
                    <button type="button" className="btn btn--primary margin-right--1" onClick={this.props.handleSave} disabled={this.props.isSaving}>Save</button>
                    <button type="button" className="btn btn--positive margin-right--1" disabled={this.props.isSaving}>Save and submit for review</button>
                    <Link to="/preview">Preview</Link>
                    {this.props.isSaving && <div className="form__loader loader loader--dark margin-left--1"></div>}
                    </div>
                </div>
        );
    }
}

DatasetMetadata.propTypes = propTypes;

export default DatasetMetadata;