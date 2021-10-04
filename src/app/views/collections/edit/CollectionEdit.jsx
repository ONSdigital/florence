import React, { Component } from "react";
import PropTypes from "prop-types";
import dateFormat from "dateformat";

import Input from "../../../components/Input";
import Select from "../../../components/Select";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import date from "../../../utilities/date";

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
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    allTeams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    publishType: PropTypes.string.isRequired,
    originalPublishType: PropTypes.string.isRequired,
    originalPublishDate: PropTypes.string.isRequired,
    isFetchingAllTeams: PropTypes.bool,
    isSavingEdits: PropTypes.bool
};

class CollectionEdit extends Component {
    constructor(props) {
        super(props);

        this.publishTypeRadioButtons = [
            {
                id: "edit-type-schedule",
                value: "scheduled",
                label: "Scheduled"
            },
            { id: "edit-type-manual", value: "manual", label: "Manual" }
        ];

        this.minimumPublishDate = dateFormat(date.getNow(), "yyyy-mm-dd");
        this.maximumPublishDate = dateFormat(date.addYear(10), "yyyy-mm-dd");
    }

    handleTeamSelection = event => {
        this.props.onTeamSelect(event.target.value);
    };

    handleTeamRemove = team => {
        this.props.onRemoveTeam(team.id);
    };

    handleNameChange = event => {
        this.props.onNameChange(event.target.value);
    };

    handlePublishTypeChange = event => {
        this.props.onPublishTypeChange(event.value);
    };

    handlePublishDateChange = event => {
        this.props.onPublishDateChange(event.target.value);
    };

    handlePublishTimeChange = event => {
        this.props.onPublishTimeChange(event.target.value);
    };

    handleSave = event => {
        event.preventDefault();
        this.props.onSave();
    };

    renderPublishDate() {
        if (!this.props.originalPublishType) {
            return;
        }

        if (this.props.originalPublishType === "manual") {
            return <p>Manual publish</p>;
        }

        if (this.props.originalPublishType === "scheduled" && this.props.originalPublishDate) {
            return <p>Publish date: {this.props.originalPublishDate}</p>;
        }

        if (this.props.originalPublishType === "scheduled" && !this.props.originalPublishDate) {
            return <p>Publish date: no publish date available</p>;
        }
    }

    render() {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8">
                            <div className="grid grid--justify-space-between grid--align-end margin-top--3 margin-bottom--2">
                                <div>
                                    <h2>{this.props.originalName}</h2>
                                    {this.renderPublishDate()}
                                </div>
                                <p id="editing-text">Editing collection...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="drawer__body">
                    <div className="grid grid--justify-space-around">
                        <form className="form grid__col-8 margin-top--1" onSubmit={this.handleSave}>
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
                                selectedOption="default-option"
                                onChange={this.handleTeamSelection}
                            />
                            <SelectedItemList disabled={this.props.isSavingEdits} items={this.props.teams} onRemoveItem={this.handleTeamRemove} />
                            <RadioGroup
                                groupName="collection-edit-type"
                                radioData={this.publishTypeRadioButtons}
                                selectedValue={this.props.publishType}
                                onChange={this.handlePublishTypeChange}
                                legend="Publish type"
                                inline={true}
                            />
                            {this.props.publishType === "scheduled" && (
                                <span>
                                    <Input
                                        type="date"
                                        id="edit-publish-date"
                                        label="Publish date"
                                        error={this.props.publishDateErrorMsg}
                                        value={this.props.publishDate}
                                        min={this.minimumPublishDate}
                                        max={this.maximumPublishDate}
                                        onChange={this.handlePublishDateChange}
                                    />
                                    <Input
                                        type="time"
                                        id="edit-publish-time"
                                        label="Publish time"
                                        error={this.props.publishTimeErrorMsg}
                                        value={this.props.publishTime}
                                        onChange={this.handlePublishTimeChange}
                                    />
                                </span>
                            )}

                            {/* Without this hidden submit input the form doesn't submit on enter consistently */}
                            <input type="submit" hidden={true} />
                        </form>
                    </div>
                </div>
                <div className="drawer__footer">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--1 margin-bottom--1">
                            <div>
                                <button disabled={this.props.isSavingEdits} className="btn btn--positive" type="button" onClick={this.handleSave}>
                                    Save and return
                                </button>
                                <button
                                    disabled={this.props.isSavingEdits}
                                    className="btn btn--margin-left"
                                    type="button"
                                    onClick={this.props.onCancel}
                                >
                                    Cancel
                                </button>
                                {this.props.isSavingEdits && (
                                    <div className="inline-block">
                                        <div className="form__loader loader"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CollectionEdit.propTypes = propTypes;

export default CollectionEdit;
