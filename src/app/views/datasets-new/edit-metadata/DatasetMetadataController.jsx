import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import uuid from 'uuid/v4';

import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import url from '../../../utilities/url'
import date from '../../../utilities/date'

import Input from '../../../components/Input';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';
import DatasetVersionsController from '../versions/DatasetVersionsController';
import SimpleEditableList from '../../../components/simple-editable-list/SimpleEditableList';


const propTypes = {

}

export class metadataController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isGettingDatasetMetadata: false,
            isGettingVersionMetadata: false,
            metadata: {
                title: "",
                summary: "",
                keywords: [],
                nationalStatistic: false,
                licence: "",
                contactName: "",
                contactEmail: "",
                contactTelephone: "",
                relatedLinks: [],
                releaseFrequency: "",
                edition: "",
                version: "",
                releaseDate: "",
                nextReleaseDate: "",
                notices: [
                    {
                        id: 0,
                        date: "Jan 2019",
                        description: "A notice",
                        type: "alert",
                    },
                    {
                        id: 1,
                        date: "Feb 2019",
                        description: "Another notice damn it",
                        type: "alert",
                    },
                ],
                dimensions: [],
            }
        }

    }

    componentWillMount() {
        const datasetID = this.props.routeParams.datasetID;
        const editionID = this.props.routeParams.editionID;
        const versionID = this.props.routeParams.versionID; 
        this.getDataset(datasetID)
        this.getVersion(datasetID, editionID, versionID)
    }

    getDataset = (datasetID) => {
        this.setState({isGettingmetadata: true})
        datasets.get(datasetID).then(dataset => {
            this.setState({metadata: this.mapDatasetToState(dataset), isGettingDatasetMetadata: false})
        })
    }

    mapDatasetToState = datasetResponse => {
        try {
            const dataset = datasetResponse.current || datasetResponse.next || datasetResponse;
            const mappedDataset = {
                title: dataset.title,
                summary: dataset.description,
                keywords: dataset.keywords,
                nationalStatistic: dataset.national_statistic,
                licence: dataset.licence || "", 
                contactName: dataset.contacts[0].name ? dataset.contacts[0].name : "",
                contactEmail: dataset.contacts[0].email ? dataset.contact[0].email : "",
                contactTelephone: dataset.contacts[0].telephone ? dataset.contacts[0].telephone : "",
                //relatedLinks: this.mapRelatedLinksToState(dataset.relatedDatasets) || [],
                releaseFrequency: dataset.release_frequency || "",
            }
            return {...this.state.metadata, ...mappedDataset}
        } catch (error) {
            console.error(error)
        }
    }

    mapRelatedLinksToState = (relatedLinks) => {
        try {
            return relatedLinks.map((link, index) => {
                return {
                    id: index,
                    type: link.title,
                    date: null,
                    description: link.description,
                    href: link.href,
                    title: link.title
                }
            })
        } catch(error) {
            console.error("Error mapping related links to state", error)
        }
    }

    getVersion = (datasetID, editionID, versionID) => {
        this.setState({isGettingmetadata: true})
        datasets.getVersion(datasetID, editionID, versionID).then(version => {
            this.setState({metadata: this.mapVersionToState(version), isGettingVersionMetadata: false});
        })
    }

    mapVersionToState = versionResponse => {
        try {
            const version = versionResponse.current || versionResponse.next || versionResponse;
            const mappedVersion =  {
                edition: version.edition,
                version: version.version,
                releaseDate: version.release_date || "",
                nextReleaseDate: version.next_release || "",
                //notices: version.alerts || [],
                dimensions: version.dimensions || [],
            }
            return {...this.state.metadata, ...mappedVersion}
        } catch (error) {
            console.error(error)
        }
    }

    mapNoticesToState = (notices) => {
        try {
            return notices.map((notice, index) => {
                return {
                    id: notice,
                    type: notice.type,
                    date: notice.date,
                    description: notice.description
                }
            })
        } catch(error) {
            console.error("Error mapping notice to state", error)
        }
    }

    handleStringInputChange = (event) => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const newMetadataState = {...this.state.metadata, [fieldName]: value};
        this.setState({metadata: newMetadataState});
    }

    handleDateInputChange = (event) => {
        const fieldName = event.target.name;
        const value = event.target.value;
        const ISODate = new Date(value).toISOString();
        const newMetadataState = {...this.state.metadata, [fieldName]: ISODate};
        console.log(newMetadataState)
        this.setState({metadata: newMetadataState});
    }

    handleSimpleEditableListAdd = (addedField, stateFieldName) => {
        console.log(addedField, stateFieldName);
        //const newMetadataState = {...this.state.metadata, [stateFieldName]: newState};
        //this.setState({metadata: newMetadataState});
    }

    handleSimpleEditableListEdit = (editedField, stateFieldName) => {
        console.log(editedField, stateFieldName);
        this.props.dispatch(push(`${this.props.location.pathname}/edit/${stateFieldName}/${editedField.id}`));
        //const newMetadataState = {...this.state.metadata, [stateFieldName]: newState};
        //this.setState({metadata: newMetadataState});
    }

    handleSimpleEditableListEditSuccess = (thing) => {
        console.log(thing)
    }

    handleSimpleEditableListDelete = (deletedField, stateFieldName) => {
        const newFieldState = this.state.metadata[stateFieldName].filter(item => item.id !== deletedField.id)
        const newMetadataState = {...this.state.metadata, [stateFieldName]: newFieldState};
        this.setState({metadata: newMetadataState});
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../../");
        this.props.dispatch(push(previousUrl));
    }

    render() {
        const child = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                data: this.state.metdata[this.props.routeParams.metadataField][this.props.routeParams.metadataItemID],
                handleSucessClick: this.handleSimpleEditableListSuccess,
                handleCancelClick: this.handleSimpleEditableListCancel
            })
        })
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-6 margin-bottom--4">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Edit metadata</h1>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Dataset</span>: {this.state.metadata.title ? this.state.metadata.title : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Edition</span>: {this.state.metadata.edition ? this.state.metadata.edition : "loading..."}</p>
                    <p className="margin-bottom--1 font-size--18"><span className="font-weight--600">Version</span>: {this.state.metadata.version ? this.state.metadata.version : "loading..."}</p>

                    <h2>Title</h2>
                    <Input id="title" value={this.state.metadata.title} onChange={this.handleStringInputChange}/>

                    <h2>Release dates</h2>
                    <Input id="release-date" name="releaseDate" label="Release date" type="date" onChange={this.handleDateInputChange} value={this.state.metadata.releaseDate && date.format(this.state.metadata.releaseDate, "yyyy-mm-dd")}/>
                    <Input id="next-release" name="nextReleaseDate" label="Next release date" type="date" onChange={this.handleDateInputChange} value={this.state.metadata.nextReleaseDate && date.format(this.state.metadata.nextReleaseDate, "yyyy-mm-dd")}/>
                    <Input id="release-frequency" name="releaseFrequency" label="Release frequency" onChange={this.handleStringInputChange} value={this.state.metadata.releaseFrequency}/>

                    <h2>Notices</h2>
                    <p className="margin-bottom--1">Add an alert, correction, change summary or usage note.</p>
                    <SimpleEditableList addText={"Add a new notice"} 
                        fields={this.state.metadata.notices} 
                        editingStateFieldName="notices"
                        handleAddClick={this.handleSimpleEditableListAdd}
                        handleEditClick={this.handleSimpleEditableListEdit}
                        handleDeleteClick={this.handleSimpleEditableListDelete}
                    />
                    
                    <h2 className="margin-top--1">About</h2>
                    <Input id="dataset-summary" label="Summary" type="textarea" value={this.state.metadata.summary}/>

                    <h2>Dimensions</h2>
                    {this.state.metadata.dimensions.map((dimension, i) => {
                        return (
                            <div key={`dimension-${i}`}>
                            <Input id={`dimension-title-${i}`} label="Title" value={dimension.name}/>
                            <Input id={`dimension-description-${i}`} label="Description" type="textarea" value={dimension.description} />
                            </div>
                        )
                    })} 

                    <h2>Meta</h2>
                    <Input id="keywords" label="Keywords" value={this.state.metadata.keywords.join(", ")}/>
                    <Input id="licence" label="Licence" onChange={this.handleStringInputChange} value={this.state.metadata.licence}/>
                    {/* <RadioGroup id="national-statistic" /> */}

                    <h2>Contact details</h2>
                    <Input id="contact-name" name="contactName" label="Contact name" onChange={this.handleStringInputChange} value={this.state.contactName} />
                    <Input id="contact-email" name="contactEmail" label="Contact email" onChange={this.handleStringInputChange} value={this.state.contactEmail} />
                    <Input id="contact-telephone" name="contactTelephone" label="Contact telephone" onChange={this.handleStringInputChange} value={this.state.contactTelephone} />

                    <h2>Related link</h2>
                    <SimpleEditableList addText={"Add a related link"} 
                        fields={this.state.metadata.relatedLinks} 
                        editingStateFieldName="relatedLinks"
                        handleAddClick={this.handleSimpleEditableListAdd}
                        handleEditClick={this.handleSimpleEditableListEdit}
                        handleDeleteClick={this.handleSimpleEditableListDelete}
                    />

                    <div className="margin-top--2">
                    <button className="btn btn--primary margin-right--1">Save</button>
                    <button className="btn btn--positive margin-right--1">Save and submit for review</button>
                    <Link to="/preview">Preview</Link>
                    </div>
                </div>
                {child}
            </div>
        )
    }
}

metadataController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        
    }
}
export default connect(mapStateToProps)(metadataController);

