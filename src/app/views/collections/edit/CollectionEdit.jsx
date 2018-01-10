import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import SelectedItemList from '../../../components/selected-items/SelectedItemList';
import RadioGroup from '../../../components/radio-buttons/RadioGroup';

const propTypes = {
    originalName: PropTypes.string,
    name: PropTypes.string,
    nameErrorMsg: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onRemoveTeam: PropTypes.func.isRequired,
    onTeamSelect: PropTypes.func.isRequired,
    onPublishTypeChange: PropTypes.func.isRequired,
    onPublishDateChange: PropTypes.func.isRequired,
    onPublishTimeChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    publishDate: PropTypes.string,
    publishDateErrorMsg: PropTypes.string,
    publishTime: PropTypes.string,
    publishTimeErrorMsg: PropTypes.string,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    allTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    publishType: PropTypes.string.isRequired,
    originalPublishType: PropTypes.string.isRequired,
    originalPublishDate: PropTypes.string.isRequired,
    isFetchingAllTeams: PropTypes.bool
};

class CollectionEdit extends Component {
    constructor(props) {
        super(props);

        this.publishTypeRadioButtons = [
            {id: "edit-type-schedule", value: "scheduled", label: "Scheduled"},
            {id: "edit-type-manual", value: "manual", label: "Manual"}
        ];

        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePublishTypeChange = this.handlePublishTypeChange.bind(this);
        this.handlePublishDateChange = this.handlePublishDateChange.bind(this);
        this.handlePublishTimeChange = this.handlePublishTimeChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleTeamSelection(event) {
        this.props.onTeamSelect(event.target.value);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    handlePublishTypeChange(event) {
        this.props.onPublishTypeChange(event.value);
    }

    handlePublishDateChange(event) {
        this.props.onPublishDateChange(event.target.value);
    }

    handlePublishTimeChange(event) {
        this.props.onPublishTimeChange(event.target.value);
    }

    handleSave(event) {
        event.preventDefault();
        this.props.onSave();
    }

    renderPublishDate() {
        if (!this.props.originalPublishType) {
            return;
        }

        if (this.props.originalPublishType === "manual") {
            return <p>Manual publish</p>
        }

        if (this.props.originalPublishType === "scheduled" && this.props.originalPublishDate) {
            return (
                <p>Publish date: {this.props.originalPublishDate}</p>
            )
        }

        if (this.props.originalPublishType === "scheduled" && !this.props.originalPublishDate) {
            return (
                <p>Publishing date: no publish date available</p>
            )
        }
    }

    render () {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-between grid--align-end">
                        <div>
                            <h2>{this.props.originalName}</h2>
                            {this.renderPublishDate()}
                        </div>
                        <p>Editing collection...</p>
                    </div>
                </div>
                <div className="drawer__body">
                    <form onSubmit={this.handleSave}>
                        <Input
                            id="collection-edit-name"
                            label="Name"
                            value={this.props.name}
                            error={this.props.nameErrorMsg}
                            onChange={this.handleNameChange}
                        />
                        <Select
                            id="collection-edit-teams"
                            label="Select a team(s) that can view this collection"
                            contents={this.props.allTeams}
                            defaultOption={this.props.isFetchingAllTeams ? "Loading teams..." : "Select an option"}
                            onChange={this.handleTeamSelection}
                        />
                        <SelectedItemList items={this.props.teams} onRemoveItem={this.props.onRemoveTeam}/>
                        <RadioGroup
                            groupName="collection-edit-type"
                            radioData={this.publishTypeRadioButtons}
                            selectedValue={this.props.publishType}
                            onChange={this.handlePublishTypeChange}
                            legend="Publish type"
                            inline={true}
                        />
                        {this.props.publishType === "scheduled" && 
                            <span>
                                <Input
                                    type="date"
                                    id="edit-publish-date"
                                    label="Publish date"
                                    error={this.props.publishDateErrorMsg}
                                    value={this.props.publishDate}
                                    onChange={this.handlePublishDateChange}
                                />
                                <Input
                                    type="time"
                                    id="edit-publish-date"
                                    label="Publish date"
                                    error={this.props.publishTimeErrorMsg}
                                    value={this.props.publishTime}
                                    onChange={this.handlePublishTimeChange}
                                />
                            </span>
                        }
                    </form>
                </div>
                <div className="drawer__footer">
                    <button className="btn" type="button" onClick={this.props.onCancel}>Cancel</button>
                    <button className="btn btn--positive btn--margin-left" type="button" onClick={this.handleSave}>Save and return</button>
                </div>
            </div>
        )
    }
}

CollectionEdit.propTypes = propTypes;

export default CollectionEdit;