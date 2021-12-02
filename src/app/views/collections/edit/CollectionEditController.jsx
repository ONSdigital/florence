import React, { Component } from "react";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import dateFormat from "dateformat";
import CollectionEdit from "./CollectionEdit";
import url from "../../../utilities/url";
import teams from "../../../utilities/api-clients/teams";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";
import {
    updateAllTeams,
    updateActiveCollection,
    addAllCollections,
    updatePagesInActiveCollection,
    updateTeamsInActiveCollection,
} from "../../../config/actions";
import collectionValidation from "../validation/collectionValidation";
import collections from "../../../utilities/api-clients/collections";
import date from "../../../utilities/date";
import collectionMapper from "../mapper/collectionMapper";
import { UNIQ_NAME_ERROR } from "../../../constants/Errors";

const propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    publishType: PropTypes.string.isRequired,
    publishDate: PropTypes.string,
    activeCollection: PropTypes.object,
    collections: PropTypes.array,
};

export class CollectionEditController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingEdits: false,
            isFetchingAllTeams: false,
            name: {
                value: props.name,
                errorMsg: "",
            },
            allTeams: [],
            updatedTeamsList: null,
            addedTeams: new Map(), // used to lookup on save to validate whether the teams have changed
            removedTeams: new Map(), // used to lookup on save to validate whether the teams have changed
            publishType: props.publishType,
            publishDate: {
                value: "",
                errorMsg: "",
            },
            publishTime: {
                value: "09:30",
                errorMsg: "",
            },
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.publishType === "scheduled" && this.props.publishDate) {
            this.setState({
                publishDate: {
                    value: date.format(this.props.publishDate, "yyyy-mm-dd"),
                    errorMsg: "",
                },
                publishTime: {
                    value: date.format(this.props.publishDate, "hh:MM"),
                    errorMsg: "",
                },
            });
        }
        this.setState({ isFetchingAllTeams: true });
        teams
            .getAll()
            .then(response => {
                const allTeams = response.map(team => {
                    let disabled = false;
                    if (this.props.teams && this.props.teams.length > 0) {
                        disabled = this.props.teams.some(addedTeam => team.id == addedTeam.id);
                    }

                    return {
                        id: team.id.toString(),
                        name: team.name,
                        disabled,
                    };
                });
                this.setState({
                    isFetchingAllTeams: false,
                    allTeams,
                });

                // Not needed for this screen but keeps teams array up-to-date for the teams screen
                this.props.dispatch(updateAllTeams(response));
            })
            .catch(error => {
                this.setState({ isFetchingAllTeams: false });
                log.event("Error fetching or mapping all teams", log.error(error));
                console.error("Error fetching or mapping all teams", error);

                if (error.status === "FETCH_ERR") {
                    const notification = {
                        type: "warning",
                        message: "A network error occurred whilst getting the list of all teams, please check your connection and refresh Florence",
                        autoDismiss: 5000,
                        isDismissable: true,
                    };
                    notifications.add(notification);
                    return;
                }

                const notification = {
                    type: "warning",
                    message: "An unexpected error occurred getting the list all teams, if you need to  edit the teams please try refreshing Florence",
                    autoDismiss: 5000,
                    isDismissable: true,
                };
                notifications.add(notification);
            });
    }

    handleNameChange = name => {
        this.setState(prevState => ({
            ...prevState.name,
            name: {
                value: name,
                errorMsg: "",
            },
        }));
    };

    handleAddTeam = teamID => {
        const currentTeams = this.state.updatedTeamsList || this.props.teams || [];

        if (!teamID) {
            return;
        }

        const teamAlreadyAdded = currentTeams.some(team => {
            return team.id === teamID;
        });
        if (teamAlreadyAdded) {
            return;
        }

        const selectedTeam = this.state.allTeams.find(team => {
            return team.id === teamID;
        });
        if (!selectedTeam) {
            const notification = {
                type: "warning",
                message: `Unable to add the team '${teamID}' to this collection because an unexpected error occured`,
                autoDismiss: 4000,
                isDismissable: true,
            };
            notifications.add(notification);
            console.error(`Unable to find team ID '${teamID}' in teams array in Redux`);
            return;
        }

        this.setState(state => {
            const newState = { ...state };
            const updatedTeamsList = [...currentTeams, selectedTeam];
            const allTeams = state.allTeams.map(team => ({
                ...team,
                disabled: team.id == selectedTeam.id ? true : team.disabled,
            }));

            if (newState.removedTeams.delete(teamID)) {
                return {
                    updatedTeamsList,
                    removedTeams: newState.removedTeams,
                    allTeams,
                };
            }

            return {
                updatedTeamsList,
                addedTeams: newState.addedTeams.set(teamID),
                allTeams,
            };
        });
    };

    handleRemoveTeam = teamID => {
        const currentTeams = this.state.updatedTeamsList || this.props.teams || [];

        this.setState(state => {
            const newState = { ...state };
            const updatedTeamsList = currentTeams.filter(team => {
                return team.id !== teamID;
            });
            const allTeams = state.allTeams.map(team => ({
                ...team,
                disabled: team.id == teamID ? false : team.disabled,
            }));

            if (newState.addedTeams.delete(teamID)) {
                return {
                    updatedTeamsList,
                    addedTeams: newState.addedTeams,
                    allTeams,
                };
            }

            return {
                updatedTeamsList,
                removedTeams: newState.removedTeams.set(teamID),
                allTeams,
            };
        });
    };

    handlePublishTypeChange = publishType => {
        if (publishType !== "manual" && publishType !== "scheduled") {
            log.event(`Attempt to select a publish type that isn't recognised`, log.warn(), log.data({ publish_type: publishType }));
            console.warn("Attempt to select a publish type that isn't recognised: ", publishType);
            return;
        }
        this.setState({ publishType });
    };

    handlePublishDateChange = date => {
        this.setState({
            publishDate: {
                value: date,
                errorMsg: "",
            },
        });
    };

    handlePublishTimeChange = time => {
        this.setState({
            publishTime: {
                value: time,
                errorMsg: "",
            },
        });
    };

    handleCancel = () => {
        this.props.dispatch(push(url.resolve("../")));
    };

    handleSave = () => {
        let hasError = false;
        let validatedName = null;
        const collectionName = this.state.name.value.trim();

        if (collectionName !== this.props.name) {
            validatedName = collectionValidation.name(collectionName, this.props.collections);
        }

        if (validatedName && !validatedName.isValid) {
            this.setState(prevState => ({
                name: {
                    ...prevState.name,
                    errorMsg: validatedName.errorMsg,
                },
            }));
            hasError = true;
        }

        if (this.state.publishType === "scheduled") {
            const validatedDate = collectionValidation.date(this.state.publishDate.value);
            if (!validatedDate.isValid) {
                this.setState({
                    publishDate: {
                        value: "",
                        errorMsg: validatedDate.errorMsg,
                    },
                });
                hasError = true;
            }
        }

        if (this.state.publishType === "scheduled") {
            const validatedTime = collectionValidation.time(this.state.publishTime.value);
            if (!validatedTime.isValid) {
                this.setState({
                    publishTime: {
                        value: "",
                        errorMsg: validatedTime.errorMsg,
                    },
                });
                hasError = true;
            }
        }

        if (hasError) {
            return;
        }

        this.setState({
            isSavingEdits: true,
        });

        collections
            .update(this.props.id, this.mapEditsToAPIRequestBody({ ...this.state }))
            .then(response => {
                const activeCollection = {
                    ...this.props.activeCollection,
                    name: response.name,
                    publishDate: response.publishDate,
                    type: response.type,
                    teams: this.state.updatedTeamsList || this.props.teams,
                };
                const allCollections = this.props.collections.map(collection => {
                    if (collection.id !== this.props.id) {
                        return collection;
                    }
                    return collectionMapper.collectionResponseToState(activeCollection);
                });
                this.props.dispatch(updateActiveCollection(activeCollection));
                this.props.dispatch(updatePagesInActiveCollection(activeCollection));
                this.props.dispatch(updateTeamsInActiveCollection(activeCollection.teams));
                this.props.dispatch(addAllCollections(allCollections));
                this.props.dispatch(push(url.resolve("../")));
            })
            .catch(error => {
                this.setState({
                    isSavingEdits: false,
                });
                switch (error.status) {
                    case 400: {
                        const notification = {
                            type: "warning",
                            message: `The values you provided couldn't be saved. Please check for any possible errors and try again.`,
                            isDismissable: true,
                            autoDismiss: 4000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case 401: {
                        // handled by request utility function
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: `You don't have permission to edit the collection '${this.props.name}'`,
                            isDismissable: true,
                            autoDismiss: 4000,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.resolve("/collections")));
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: `Collection '${this.props.name}' no longer exists, so you've been redirected to the main collections screen`,
                            isDismissable: true,
                            autoDismiss: 4000,
                        };
                        notifications.add(notification);
                        this.props.dispatch(push(url.resolve("/collections")));
                        break;
                    }
                    case 409: {
                        log.event(
                            "Attempt to rename collection to existing collection name",
                            log.error(error),
                            log.data({
                                current_name: this.props.name,
                                new_name: this.state.name.value,
                            })
                        );
                        this.setState(state => ({
                            name: {
                                value: state.name.value,
                                errorMsg: UNIQ_NAME_ERROR,
                            },
                        }));
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: `An unexpected error occurred whilst saving the edits to collection '${this.props.name}'`,
                            isDismissable: true,
                            autoDismiss: 4000,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                log.event("Error saving collection details", log.error(error), log.data({ collection_id: this.props.id }));
                console.error("Error saving collection details update", error);
            });
    };

    teamsHaveChanged(state) {
        if (state.addedTeams.size > 0 || state.removedTeams.size > 0) {
            return true;
        }

        return false;
    }

    publishDateHasChanged(state) {
        if (state.publishType === "manual") {
            return false;
        }

        try {
            const newPublishDate = new Date(state.publishDate.value + " " + state.publishTime.value).toISOString();
            if (newPublishDate !== this.props.publishDate) {
                return true;
            }
        } catch (error) {
            log.event("Error creating new publish date from string", log.error(error));
            console.error("Error creating new publish date from string: " + error);
            return false;
        }

        return false;
    }

    mapEditsToAPIRequestBody(state) {
        let body = {};

        if (state.name.value !== this.props.name) {
            body.name = state.name.value.trim();
        }

        if (this.teamsHaveChanged(state)) {
            // Switch the teams array of objects back to an array of strings.
            // Basically, we read from teamsDetails but write to teams, so not to
            // break what Zebedee is expecting but still be able to use the team IDs
            body.teams = state.updatedTeamsList.map(team => team.name);
        }

        if (state.publishType !== this.props.publishType) {
            body.type = state.publishType;
        }

        if (this.publishDateHasChanged(state)) {
            body.publishDate =
                state.publishType === "scheduled" ? new Date(state.publishDate.value + " " + state.publishTime.value).toISOString() : "";
        }

        return body;
    }

    render() {
        return (
            <CollectionEdit
                {...this.props}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
                onNameChange={this.handleNameChange}
                onTeamSelect={this.handleAddTeam}
                onRemoveTeam={this.handleRemoveTeam}
                onPublishTypeChange={this.handlePublishTypeChange}
                onPublishDateChange={this.handlePublishDateChange}
                onPublishTimeChange={this.handlePublishTimeChange}
                originalName={this.props.name}
                name={this.state.name.value}
                nameErrorMsg={this.state.name.errorMsg}
                originalPublishType={this.props.publishType}
                publishType={this.state.publishType}
                originalPublishDate={dateFormat(this.props.publishDate, "dddd, d mmmm yyyy h:MMTT")}
                publishDate={this.state.publishDate.value}
                publishDateErrorMsg={this.state.publishDate.errorMsg}
                publishTime={this.state.publishTime.value}
                publishTimeErrorMsg={this.state.publishTime.errorMsg}
                teams={this.state.updatedTeamsList || this.props.teams || []}
                allTeams={this.state.isFetchingAllTeams ? [] : this.state.allTeams}
                isFetchingAllTeams={this.state.isFetchingAllTeams}
                isSavingEdits={this.state.isSavingEdits}
            />
        );
    }
}

CollectionEditController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        teams: state.state.collections.active ? state.state.collections.active.teams : undefined,
        publishType: state.state.collections.active ? state.state.collections.active.type : undefined,
        publishDate: state.state.collections.active ? state.state.collections.active.publishDate : undefined,
        activeCollection: state.state.collections.active,
        collections: state.state.collections.all,
    };
}

export default connect(mapStateToProps)(CollectionEditController);
