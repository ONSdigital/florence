import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import collections from '../../../utilities/api-clients/collections';
import teams from '../../../utilities/api-clients/teams';
import notifications from '../../../utilities/notifications';
import log, { eventTypes } from '../../../utilities/log';

import Input from '../../../components/Input';
import Select from '../../../components/Select';
import SelectedItemList from '../../../components/selected-items/SelectedItemList'
import RadioGroup from '../../../components/radio-buttons/RadioGroup';
import { updateAllTeamIDsAndNames, updateAllTeams } from '../../../config/actions';
import collectionValidation from '../validation/collectionValidation';

const propTypes = {
    user: PropTypes.shape({
        userType: PropTypes.string.isRequired,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    dispatch: PropTypes.func.isRequired
};

export class CollectionCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newCollectionDetails: {
                name: {
                    value: "",
                    errorMsg: ""
                },
                type: "scheduled",
                publishDate: {
                    value: "",
                    errorMsg: ""
                },
                publishTime: {
                    value: "09:30",
                    errorMsg: ""
                },
                pendingDeletes: [],
                teams: [],
                releaseUri: "",
                scheduleType: "custom-schedule",
            },
            isGettingTeams: true,
            isSubmitting: false
        };

        this.baseNewCollectionDetails = this.state.newCollectionDetails;

        this.handleCollectionNameChange = this.handleCollectionNameChange.bind(this);
        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleRemoveTeam = this.handleRemoveTeam.bind(this);
        this.handleCollectionTypeChange = this.handleCollectionTypeChange.bind(this);
        this.handleScheduleTypeChange = this.handleScheduleTypeChange.bind(this);
        this.handlePublishDateChange = this.handlePublishDateChange.bind(this);
        this.handlePublishTimeChange = this.handlePublishTimeChange.bind(this);
        this.handleAddRelease = this.handleAddRelease.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.getListOfTeams();
    }

    // return a date in ISO format (yyyy-mm-dd). returns todays date by default,
    // or same date but however many years ahead
    getTodayDate(yearsAhead) {
        const years = typeof yearsAhead === 'number' ? yearsAhead : 0;
        return (new Date(new Date().setFullYear(new Date().getFullYear() + years)).toISOString().split('T')[0]);
    }

    getListOfTeams() {
        teams.getAll().then(teams => {
            if (teams.length === 0) {
                const notification = {
                    "type": "warning",
                    "message": "Failed to get teams. You should be able to add teams after creating the collection or you can try refreshing",
                    isDismissable: true
                };
                notifications.add(notification);
                this.setState({ isGettingTeams: false });
                return
            }
            const allTeams = teams.map(team => {
                return {id: team.id.toString(), name: team.name}
            });
            this.setState({
                isGettingTeams: false
            });
            this.props.dispatch(updateAllTeamIDsAndNames(allTeams));
            
            // Not needed for this screen but keeps teams array up-to-date for the teams screen
            this.props.dispatch(updateAllTeams(teams));
        }).catch(error => {
            switch(error.status) {
                case(401): {
                    // This is handled by the request function, so do nothing here
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to get teams. You can still create the collection without teams, or refresh",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get teams. You can still create the collection without teams, or refresh",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get teams. Try refresh the page",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }

            console.error("Error fetching all teams:\n", error);
        });
    }

    handleCollectionNameChange(event) {
        const collectionName = {
            value: event.target.value,
            errorMsg: ""
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            name: collectionName
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handleTeamSelection(event) {
        if (!event.target.value) {
            return;
        }

        const teamID = event.target.value;

        // check if team already exists in collection
        for (let i = 0; i < this.state.newCollectionDetails.teams.length; i++) {
            if (this.state.newCollectionDetails.teams[i].id === teamID) {
                return;
            }
        }

        // get info for selected team from teams list in state
        const selectedTeam = this.props.allTeams.find(team => {
            return team.id === teamID;
        });

        const teams = [...this.state.newCollectionDetails.teams, selectedTeam];

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            teams: teams
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handleRemoveTeam(teamToRemove) {
        const updatedTeams = this.state.newCollectionDetails.teams.filter(team => {
            return team.id !== teamToRemove.id
        });

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            teams: updatedTeams
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handleCollectionTypeChange(event) {
        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            type: event.value
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handleScheduleTypeChange(event) {
        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            scheduleType: event.value
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handlePublishDateChange(event) {
        const publishDate = {
            value: event.target.value,
            errorMsg: ""
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            publishDate: publishDate
        };
        this.setState({newCollectionDetails: newCollectionDetails});
    }

    handlePublishTimeChange(event) {
        const publishTime = {
            value: event.target.value,
            errorMsg: ""
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            publishTime: publishTime
        };
        this.setState({newCollectionDetails: newCollectionDetails});

    }

    handleAddRelease(event) {
        event.preventDefault();
        console.warn("We haven't built this feature yet")
    }

    makePublishDate() {
        if (this.state.newCollectionDetails.type === 'scheduled') {
            const date = this.state.newCollectionDetails.publishDate.value;
            const time = this.state.newCollectionDetails.publishTime.value;
            return (new Date(date + " " + time).toISOString());
        } else {
            return null;
        }
    }

    mapStateToPostBody() {
        try {
            return {
                name: this.state.newCollectionDetails.name.value,
                type: this.state.newCollectionDetails.type,
                publishDate: this.makePublishDate(),
                teams: this.state.newCollectionDetails.teams.map(team => {
                    return team.name;
                }),
                collectionOwner: this.props.user.userType,
                releaseUri: this.state.newCollectionDetails.releaseUri || null
            }
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, "Error mapping new collection state to POST body" + JSON.stringify(error));
            console.error("Error mapping new collection state to POST body" + error);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({isSubmitting: true});

        let hasError = false;
        let newCollectionDetails = this.state.newCollectionDetails

        const validatedName = collectionValidation.name(this.state.newCollectionDetails.name.value);
        if (!validatedName.isValid) {
            const collectionName = {
                value: this.state.newCollectionDetails.name.value,
                errorMsg: validatedName.errorMsg
            };

            newCollectionDetails = {
                ...newCollectionDetails,
                name: collectionName
            };
            hasError = true;
        }

        const validatedDate = collectionValidation.date(this.state.newCollectionDetails.publishDate.value, this.state.newCollectionDetails.type);
        if (!validatedDate.isValid) {
            const collectionDate = {
                value: this.state.newCollectionDetails.publishDate.value,
                errorMsg: validatedDate.errorMsg
            };

            newCollectionDetails = {
                ...newCollectionDetails,
                publishDate: collectionDate
            };
            hasError = true;
        }

        const validatedTime = collectionValidation.time(this.state.newCollectionDetails.publishTime.value, this.state.newCollectionDetails.type);
        if (!validatedTime.isValid) {
            const collectionTime = {
                value: this.state.newCollectionDetails.publishTime.value,
                errorMsg: validatedTime.errorMsg
            };

            newCollectionDetails = {
                ...newCollectionDetails,
                publishTime: collectionTime
            };
            this.setState({
                newCollectionDetails: newCollectionDetails,
                isSubmitting: false
            });
            hasError = true;
        }

        if (hasError) {
            this.setState({
                newCollectionDetails,
                isSubmitting: false
            });
            return;
        }

        collections.create(this.mapStateToPostBody()).then(response => {
            this.setState({ newCollectionDetails: this.baseNewCollectionDetails, isSubmitting: false });
            this.props.onSuccess(response);
        }).catch(error => {
            this.setState({isSubmitting: false});
            switch(error.status) {
                case(400): {
                    const notification = {
                        "type": "warning",
                        "message": "There was an error creating the collection. Please check inputs and try again.",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case (409): {
                    log.add(eventTypes.runtimeWarning, {message: "409 response because there was an attempt to create a collection with an existing collection name: " + this.state.newCollectionDetails.name.value});
                    const collectionName = {
                        value: this.state.newCollectionDetails.name.value,
                        errorMsg: "A collection with this name already exists"
                    };
                    const newCollectionDetails = {
                        ...this.state.newCollectionDetails,
                        name: collectionName
                    };
                    this.setState({
                        newCollectionDetails: newCollectionDetails,
                        isSubmitting: false
                    });
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error has occured whilst creating collection`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error(error);
        });
    }

    renderScheduleOptions() {
        const radioData = [
            {id: "custom-radio", value: "custom-schedule", label: "Custom schedule"},
            {id: "calendar-radio", value: "calender-entry-schedule", label: "Calendar entry schedule"} ];
        const showCustomScheduleOptions = this.state.newCollectionDetails.scheduleType === "custom-schedule";

        return (
            <div>
                <RadioGroup
                    groupName="schedule-type"
                    radioData={radioData}
                    selectedValue={this.state.newCollectionDetails.scheduleType}
                    onChange={this.handleScheduleTypeChange}
                    legend="Schedule type"
                    inline={true}
                />

                {showCustomScheduleOptions ?
                    <div>
                        <Input
                            id="publish-date"
                            label="Publish date"
                            type="date"
                            onChange={this.handlePublishDateChange}
                            error={this.state.newCollectionDetails.publishDate.errorMsg}
                            value={this.state.newCollectionDetails.publishDate.value}
                            min={this.getTodayDate()}
                            max={this.getTodayDate(10)}
                        />

                        <Input
                            id="publish-time"
                            label="Publish time"
                            type="time"
                            value={this.state.newCollectionDetails.publishTime.value}
                            onChange={this.handlePublishTimeChange}
                            error={this.state.newCollectionDetails.publishTime.errorMsg}
                        />
                    </div>

                    : <button onClick={this.handleAddRelease} className="btn btn--primary margin-bottom--2 ">Select a calendar entry</button> }

            </div>
        )
    }

    render () {
        const radioData = [
            {id: "scheduled-radio", value: "scheduled", label: "Scheduled publish"},
            {id: "manual-radio", value: "manual", label: "Manual publish"} ];
        const showScheduleOptions = this.state.newCollectionDetails.type === "scheduled";
        const isSubmitting = this.state.isSubmitting;
        const hasTeams = !this.state.isGettingTeams;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Input
                        id="collection-name"
                        label="Collection name"
                        type="text"
                        error={this.state.newCollectionDetails.name.errorMsg}
                        value={this.state.newCollectionDetails.name.value}
                        onChange={this.handleCollectionNameChange}
                    />

                    <Select
                        id="collection-teams"
                        label="Select a team(s) that can view this collection"
                        contents={hasTeams ? this.props.allTeams : []}
                        defaultOption={hasTeams ? "Select an option" : "Loading teams..."}
                        onChange={this.handleTeamSelection}
                    />

                    {this.state.newCollectionDetails.teams ?
                        <SelectedItemList items={this.state.newCollectionDetails.teams} onRemoveItem={this.handleRemoveTeam}/>
                        : ""
                    }

                    <RadioGroup
                        groupName="release-type"
                        radioData={radioData}
                        selectedValue={this.state.newCollectionDetails.type}
                        onChange={this.handleCollectionTypeChange}
                        legend="Publish type"
                        inline={true}
                    />

                    {showScheduleOptions ? this.renderScheduleOptions() : "" }

                    <button type="submit" className="btn btn--positive" disabled={isSubmitting}>
                        Create collection
                    </button>

                    {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                </form>
            </div>
        )
    }
}

CollectionCreate.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        allTeams: state.state.teams.allIDsAndNames
    }
}

export default connect(mapStateToProps)(CollectionCreate);

