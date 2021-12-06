import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import collections from "../../../utilities/api-clients/collections";
import teams from "../../../utilities/api-clients/teams";
import notifications from "../../../utilities/notifications";
import log from "../../../utilities/logging/log";
import CollectionCreate from "./CollectionCreate";
import { createCollectionRequest } from "../../../config/thunks";
import { updateAllTeamIDsAndNames, updateAllTeams } from "../../../config/actions";
import collectionValidation from "../validation/collectionValidation";
import { UNIQ_NAME_ERROR } from "../../../constants/Errors";
import { getActive, getCollectionCreating } from "../../../config/selectors";

const propTypes = {
    user: PropTypes.shape({
        userType: PropTypes.string.isRequired,
    }).isRequired,
    allTeams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    dispatch: PropTypes.func.isRequired,
    collections: PropTypes.array,
};

export class CollectionCreateController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newCollectionDetails: {
                name: {
                    value: "",
                    errorMsg: "",
                },
                type: "scheduled",
                publishDate: {
                    value: "",
                    errorMsg: "",
                },
                publishTime: {
                    value: "09:30",
                    errorMsg: "",
                },
                pendingDeletes: [],
                teams: [],
                release: {
                    date: "",
                    title: "",
                    uri: "",
                    isProvisional: null,
                    errorMsg: "",
                },
                scheduleType: "custom-schedule",
            },
            isGettingTeams: true,
            isSubmitting: false,
            showScheduleByRelease: false,
            updatedAllTeams: null,
        };

        this.blankNewCollectionDetails = this.state.newCollectionDetails;
    }

    UNSAFE_componentWillMount() {
        this.getAllTeams();
    }

    getAllTeams() {
        teams
            .getAll()
            .then(teams => {
                if (teams.length === 0) {
                    this.setState({ isGettingTeams: false });
                    return;
                }
                const allTeams = teams.map(team => {
                    return { id: team.id.toString(), name: team.name };
                });
                this.setState({
                    isGettingTeams: false,
                });
                this.props.dispatch(updateAllTeamIDsAndNames(allTeams));

                // Not needed for this screen but keeps teams array up-to-date for the teams screen
                this.props.dispatch(updateAllTeams(teams));
            })
            .catch(error => {
                switch (error.status) {
                    case 401: {
                        // This is handled by the request function, so do nothing here
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get teams. You can still create the collection without teams, or refresh",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get teams. You can still create the collection without teams, or refresh",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "There's been a network error whilst trying to get teams. Try refresh the page",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }

                console.error("Error fetching all teams:\n", error);
            });
    }

    handleCollectionNameChange = event => {
        const collectionName = {
            value: event.target.value,
            errorMsg: "",
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            name: collectionName,
        };
        this.setState({ newCollectionDetails });
    };

    handleTeamSelection = event => {
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
        const allTeams = this.state.updatedAllTeams || this.props.allTeams || [];
        const updatedAllTeams = allTeams.map(team => {
            if (team.id == teamID) {
                return {
                    ...team,
                    disabled: true,
                };
            }
            return team;
        });

        const teams = [...this.state.newCollectionDetails.teams, selectedTeam];

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            teams: teams,
        };
        this.setState({
            newCollectionDetails,
            updatedAllTeams,
        });
    };

    handleRemoveTeam = teamToRemove => {
        const updatedTeams = this.state.newCollectionDetails.teams.filter(team => {
            return team.id !== teamToRemove.id;
        });
        const updatedAllTeams = this.state.updatedAllTeams.map(team => {
            if (team.id === teamToRemove.id) {
                return {
                    ...team,
                    disabled: false,
                };
            }
            return team;
        });

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            teams: updatedTeams,
        };
        this.setState({
            newCollectionDetails,
            updatedAllTeams,
        });
    };

    handleCollectionTypeChange = event => {
        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            type: event.value,
            release: {
                uri: "",
                date: "",
                title: "",
                errorMsg: "",
            },
        };
        this.setState({ newCollectionDetails });
    };

    handleScheduleTypeChange = event => {
        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            scheduleType: event.value,
        };
        this.setState({ newCollectionDetails });
    };

    handlePublishDateChange = event => {
        const publishDate = {
            value: event.target.value,
            errorMsg: "",
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            publishDate: publishDate,
        };
        this.setState({ newCollectionDetails });
    };

    handlePublishTimeChange = event => {
        const publishTime = {
            value: event.target.value,
            errorMsg: "",
        };

        const newCollectionDetails = {
            ...this.state.newCollectionDetails,
            publishTime: publishTime,
        };
        this.setState({ newCollectionDetails });
    };

    handleAddRelease = event => {
        event.preventDefault();
        this.setState({ showScheduleByRelease: true });
    };

    handleSelectRelease = release => {
        this.setState(state => ({
            newCollectionDetails: {
                ...state.newCollectionDetails,
                release: {
                    uri: release.uri,
                    title: release.title,
                    date: release.releaseDate,
                    isProvisional: release.isProvisional,
                    errorMsg: "",
                },
            },
            showScheduleByRelease: false,
        }));
    };

    handleCloseRelease = () => {
        this.setState({ showScheduleByRelease: false });
    };

    makePublishDate() {
        if (this.state.newCollectionDetails.type !== "scheduled") {
            return null;
        }

        if (this.state.newCollectionDetails.scheduleType === "calender-entry-schedule") {
            return this.state.releaseDateISO;
        }

        const date = this.state.newCollectionDetails.publishDate.value;
        const time = this.state.newCollectionDetails.publishTime.value;
        return new Date(date + " " + time).toISOString();
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
                releaseUri:
                    this.state.newCollectionDetails.scheduleType === "calender-entry-schedule" ? this.state.newCollectionDetails.release.uri : null,
            };
        } catch (error) {
            log.event("Error mapping new collection state to POST body", log.error(error));
            console.error("Error mapping new collection state to POST body" + error);
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({ isSubmitting: true });

        let hasError = false;
        let newCollectionDetails = this.state.newCollectionDetails;
        const validatedName = collectionValidation.name(this.state.newCollectionDetails.name.value, this.props.collections);

        if (!validatedName.isValid) {
            const collectionName = {
                value: this.state.newCollectionDetails.name.value,
                errorMsg: validatedName.errorMsg,
            };

            newCollectionDetails = {
                ...newCollectionDetails,
                name: collectionName,
            };
            hasError = true;
        }

        if (this.state.newCollectionDetails.type === "scheduled" && this.state.newCollectionDetails.scheduleType === "custom-schedule") {
            const validatedDate = collectionValidation.date(this.state.newCollectionDetails.publishDate.value);
            if (!validatedDate.isValid) {
                const collectionDate = {
                    value: this.state.newCollectionDetails.publishDate.value,
                    errorMsg: validatedDate.errorMsg,
                };

                newCollectionDetails = {
                    ...newCollectionDetails,
                    publishDate: collectionDate,
                };
                hasError = true;
            }
        }

        if (this.state.newCollectionDetails.type === "scheduled" && this.state.newCollectionDetails.scheduleType === "custom-schedule") {
            const validatedTime = collectionValidation.time(this.state.newCollectionDetails.publishTime.value);
            if (!validatedTime.isValid) {
                const collectionTime = {
                    value: this.state.newCollectionDetails.publishTime.value,
                    errorMsg: validatedTime.errorMsg,
                };

                newCollectionDetails = {
                    ...newCollectionDetails,
                    publishTime: collectionTime,
                };
                this.setState({
                    newCollectionDetails: newCollectionDetails,
                    isSubmitting: false,
                });
                hasError = true;
            }
        }

        if (this.state.newCollectionDetails.type === "scheduled" && this.state.newCollectionDetails.scheduleType === "calender-entry-schedule") {
            const release = this.state.newCollectionDetails.release;
            const validatedRelease = collectionValidation.release(release);
            if (!validatedRelease.isValid) {
                const collectionRelease = {
                    ...release,
                    errorMsg: validatedRelease.errorMsg,
                };

                newCollectionDetails = {
                    ...newCollectionDetails,
                    release: collectionRelease,
                };
                this.setState({
                    newCollectionDetails,
                    isSubmitting: false,
                });
                hasError = true;
            }
        }

        if (hasError) {
            this.setState({
                newCollectionDetails,
                isSubmitting: false,
            });
            return;
        }
        this.props.dispatch(createCollectionRequest(this.mapStateToPostBody()));

        this.setState({
            isSubmitting: false,
        });
    };

    render() {
        return (
            <>
                <CollectionCreate
                    newCollectionDetails={this.state.newCollectionDetails}
                    handleCollectionNameChange={this.handleCollectionNameChange}
                    handleTeamSelection={this.handleTeamSelection}
                    handleRemoveTeam={this.handleRemoveTeam}
                    handleCollectionTypeChange={this.handleCollectionTypeChange}
                    showScheduleOptions={this.state.newCollectionDetails.type === "scheduled"}
                    showCustomScheduleOptions={this.state.newCollectionDetails.scheduleType === "custom-schedule"}
                    handleSelectRelease={this.handleSelectRelease}
                    handleCloseRelease={this.handleCloseRelease}
                    hasTeams={!this.state.isGettingTeams}
                    allTeams={this.state.updatedAllTeams || this.props.allTeams || []}
                    handleScheduleTypeChange={this.handleScheduleTypeChange}
                    handlePublishTimeChange={this.handlePublishTimeChange}
                    handlePublishDateChange={this.handlePublishDateChange}
                    handleAddRelease={this.handleAddRelease}
                    showScheduleByRelease={this.state.showScheduleByRelease}
                    onSubmit={this.handleSubmit}
                    isSubmitting={this.state.isSubmitting}
                />
            </>
        );
    }
}

CollectionCreateController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        allTeams: state.state.teams.allIDsAndNames,
        newCollection: getActive(state.state),
    };
}

export default connect(mapStateToProps)(CollectionCreateController);
