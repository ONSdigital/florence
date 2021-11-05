import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../../../components/Input";
import Select from "../../../components/Select";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import Modal from "../../../components/Modal";
import ScheduleByRelease from "../schedule-by-release/ScheduleByRelease";
import date from "../../../utilities/date";

const propTypes = {
    newCollectionDetails: PropTypes.shape({
        name: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        publishDate: PropTypes.object.isRequired,
        publishTime: PropTypes.object.isRequired,
        pendingDeletes: PropTypes.array.isRequired,
        teams: PropTypes.array.isRequired,
        release: PropTypes.object.isRequired,
        scheduleType: PropTypes.string.isRequired,
    }).isRequired,
    handleCollectionNameChange: PropTypes.func.isRequired,
    handleTeamSelection: PropTypes.func.isRequired,
    handleRemoveTeam: PropTypes.func.isRequired,
    handleCollectionTypeChange: PropTypes.func.isRequired,
    showScheduleOptions: PropTypes.bool.isRequired,
    showCustomScheduleOptions: PropTypes.bool.isRequired,
    handleSelectRelease: PropTypes.func.isRequired,
    handleCloseRelease: PropTypes.func.isRequired,
    hasTeams: PropTypes.bool.isRequired,
    allTeams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    handleScheduleTypeChange: PropTypes.func.isRequired,
    handlePublishTimeChange: PropTypes.func.isRequired,
    handlePublishDateChange: PropTypes.func.isRequired,
    handleAddRelease: PropTypes.func.isRequired,
    showScheduleByRelease: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

class CollectionCreate extends Component {
    constructor(props) {
        super(props);
    }

    renderScheduleOptions() {
        const scheduleOptionsRadioData = [
            {
                id: "custom-radio",
                value: "custom-schedule",
                label: "Custom schedule",
            },
            {
                id: "calendar-radio",
                value: "calender-entry-schedule",
                label: "Calendar entry schedule",
            },
        ];

        return (
            <div>
                <RadioGroup
                    groupName="schedule-type"
                    radioData={scheduleOptionsRadioData}
                    selectedValue={this.props.newCollectionDetails.scheduleType}
                    onChange={this.props.handleScheduleTypeChange}
                    legend="Schedule type"
                    inline={true}
                />

                {this.props.showCustomScheduleOptions ? (
                    <div>
                        <Input
                            id="publish-date"
                            label="Publish date"
                            type="date"
                            onChange={this.props.handlePublishDateChange}
                            error={this.props.newCollectionDetails.publishDate.errorMsg}
                            value={this.props.newCollectionDetails.publishDate.value}
                            min={date.format(date.getNow(), "yyyy-mm-dd")}
                            max={date.format(date.addYear(10), "yyyy-mm-dd")}
                        />

                        <Input
                            id="publish-time"
                            label="Publish time"
                            type="time"
                            value={this.props.newCollectionDetails.publishTime.value}
                            onChange={this.props.handlePublishTimeChange}
                            error={this.props.newCollectionDetails.publishTime.errorMsg}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="margin-bottom--1">
                            {this.props.newCollectionDetails.release ? (
                                <div>
                                    <p>Selected release: </p>
                                    <p className="font-weight--600 colour--night-shadz">{this.props.newCollectionDetails.release.errorMsg}</p>
                                    <p className="font-weight--600">
                                        {this.props.newCollectionDetails.release.isProvisional && "[Not finalised] "}
                                        {this.props.newCollectionDetails.release.title}
                                    </p>
                                </div>
                            ) : (
                                <p>No release selected</p>
                            )}
                        </div>
                        <button type="button" onClick={this.props.handleAddRelease} className="btn btn--primary margin-bottom--2 ">
                            Select {this.props.newCollectionDetails.release.uri && "different "}a calendar entry
                        </button>
                    </div>
                )}
            </div>
        );
    }

    render() {
        const releaseTypeRadioData = [
            {
                id: "scheduled-radio",
                value: "scheduled",
                label: "Scheduled publish",
            },
            { id: "manual-radio", value: "manual", label: "Manual publish" },
        ];

        return (
            <>
                <form onSubmit={this.props.onSubmit}>
                    <Input
                        id="collection-name"
                        label="Collection name"
                        type="text"
                        error={this.props.newCollectionDetails.name.errorMsg}
                        value={this.props.newCollectionDetails.name.value}
                        onBlur={this.props.handleCollectionNameValidation}
                        onChange={this.props.handleCollectionNameChange}
                    />

                    <Select
                        id="collection-teams"
                        label="Select a team(s) that can view this collection"
                        contents={this.props.hasTeams ? this.props.allTeams : []}
                        defaultOption={this.props.hasTeams ? "Select an option" : "Loading teams..."}
                        selectedOption={"default-option"}
                        onChange={this.props.handleTeamSelection}
                    />

                    {this.props.newCollectionDetails.teams ? (
                        <SelectedItemList items={this.props.newCollectionDetails.teams} onRemoveItem={this.props.handleRemoveTeam} />
                    ) : (
                        ""
                    )}

                    <RadioGroup
                        groupName="release-type"
                        radioData={releaseTypeRadioData}
                        selectedValue={this.props.newCollectionDetails.type}
                        onChange={this.props.handleCollectionTypeChange}
                        legend="Publish type"
                        inline={true}
                    />

                    {this.props.showScheduleOptions ? this.renderScheduleOptions() : ""}

                    <button type="submit" className="btn btn--positive margin-top--1" disabled={this.props.isSubmitting}>
                        Create collection
                    </button>

                    {this.props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}
                </form>
                {this.props.showScheduleByRelease && (
                    <Modal sizeClass="grid__col-8">
                        <ScheduleByRelease onClose={this.props.handleCloseRelease} onSubmit={this.props.handleSelectRelease} />
                    </Modal>
                )}
            </>
        );
    }
}

CollectionCreate.propTypes = propTypes;

export default CollectionCreate;
