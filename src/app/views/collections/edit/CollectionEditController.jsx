import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

import CollectionEdit from './CollectionEdit';
import url from '../../../utilities/url';
import teams from '../../../utilities/api-clients/teams';
import log, {eventTypes} from '../../../utilities/log';
import notifications from '../../../utilities/notifications';
import { updateAllTeamIDsAndNames , updateAllTeams, updateActiveCollection, addAllCollections, updatePagesInActiveCollection} from '../../../config/actions';
import collectionValidation from '../validation/collectionValidation';
import collections from '../../../utilities/api-clients/collections';
import date from '../../../utilities/date';
import collectionMapper from '../mapper/collectionMapper';

const propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    publishType: PropTypes.string.isRequired,
    publishDate: PropTypes.string,
    activeCollection: PropTypes.object,
    collections: PropTypes.array
};

export class CollectionEditController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingEdits: false,
            isFetchingAllTeams: false,
            name: {
                value: props.name,
                errorMsg: ""
            },
            teams: props.teams,
            addedTeams: new Map, // used to lookup on save to validate whether the teams have changed
            removedTeams: new Map, // used to lookup on save to validate whether the teams have changed
            publishType: props.publishType,
            publishDate: {
                value: "",
                errorMsg: ""
            },
            publishTime: {
                value: "09:30",
                errorMsg: ""
            }
        }

        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handlePublishTypeChange = this.handlePublishTypeChange.bind(this);
        this.handlePublishDateChange = this.handlePublishDateChange.bind(this);
        this.handlePublishTimeChange = this.handlePublishTimeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleAddTeam = this.handleAddTeam.bind(this);
        this.handleRemoveTeam = this.handleRemoveTeam.bind(this);
    }

    componentWillMount() {
        if (this.props.publishType === "scheduled" && this.props.publishDate) {
            this.setState({
                publishDate: {
                    value: date.format(this.props.publishDate, "yyyy-mm-dd"),
                    errorMsg: ""
                },
                publishTime: {
                    value: date.format(this.props.publishDate, "hh:MM"),
                    errorMsg: ""
                }
            });
        }
        this.setState({
            isFetchingAllTeams: true
        });
        teams.getAll().then(response => {
            const teams = response.map(team => {
                return {id: team.id.toString(), name: team.name}
            });
            this.setState({
                isFetchingAllTeams: false
            });
            this.props.dispatch(updateAllTeamIDsAndNames(teams));

            // Not needed for this screen but keeps teams array up-to-date for the teams screen
            this.props.dispatch(updateAllTeams(response));
        }).catch(error => {
            this.setState({
                isFetchingAllTeams: false
            });
            log.add(eventTypes.unexpectedRuntimeError, "Error fetching or mapping all teams" + JSON.stringify(error));
            console.error("Error fetching or mapping all teams", error);
            
            if (error.status === "FETCH_ERR") {
                const notification = {
                    type: 'warning',
                    message: 'A network error occurred whilst getting the list of all teams, please check your connection and refresh Florence',
                    autoDismiss: 5000,
                    isDismissable: true
                }
                notifications.add(notification);
                return;
            }

            const notification = {
                type: 'warning',
                message: 'An unexpected error occured getting the list all teams, if you need edit the teams please try refreshing Florence',
                autoDismiss: 5000,
                isDismissable: true
            }
            notifications.add(notification);
        });
    }

    handleNameChange(name) {
        this.setState({
            name: {
                value: name,
                errorMsg: ""
            }
        });
    }
    
    handleNameBlur(name) {
        console.log({name});
        this.setState({
            name: {
                ...this.state.name,
                value: name.trim()
            }
        });
    }

    handleAddTeam(teamID) {
        if (!teamID) {
            return;
        }

        const teamAlreadyAdded = this.state.teams.some(team => {
            return team.id === teamID;
        });
        if (teamAlreadyAdded) {
            return;
        }

        const selectedTeam = this.props.allTeams.find(team => {
            return team.id === teamID;
        });
        if (!selectedTeam) {
            const notification = {
                type: 'warning',
                message: `Unable to add the team '${teamID}' to this collection because an unexpected error occured`,
                autoDismiss: 4000,
                isDismissable: true
            };
            notifications.add(notification);
            console.error(`Unable to find team ID '${teamID}' in teams array in Redux`);
            return;
        }
        this.setState(state => {
            const newState = {...state};
            if (newState.removedTeams.delete(teamID)) {
                return {
                    teams: [...newState.teams, selectedTeam],
                    removedTeams: newState.removedTeams      
                }
            }

            return {
                teams: [...newState.teams, selectedTeam],
                addedTeams: newState.addedTeams.set(teamID)
            }
    });
    }

    handleRemoveTeam(teamID) {
        this.setState(state => {
            const newState = {...state};
            if (newState.addedTeams.delete(teamID)) {
                return {
                    teams: newState.teams.filter(team => {
                        return team.id !== teamID
                    }),
                    addedTeams: newState.addedTeams
                }
            }

            return {
                teams: newState.teams.filter(team => {
                    return team.id !== teamID
                }),
                removedTeams: newState.removedTeams.set(teamID),
                
            }
        });
    }

    handlePublishTypeChange(publishType) {
        if (publishType !== "manual" && publishType !== "scheduled") {
            log.add(eventTypes.runtimeWarning, {message: "Attempt to select a publish type that isn't recognised: ", publishType});
            console.warn("Attempt to select a publish type that isn't recognised: ", publishType);
            return;
        }
        this.setState({publishType});
    }

    handlePublishDateChange(date) {
        this.setState({
            publishDate: {
                value: date,
                errorMsg: ""
            }
        });
    }
    
    handlePublishTimeChange(time) {
        this.setState({
            publishTime: {
                value: time,
                errorMsg: ""
            }
        });
    }

    handleCancel() {
        this.props.dispatch(push(url.resolve('../')));
    }

    handleSave() {
        let hasError = false;
        
        const trimmedName = this.state.name.value.trim();

        // Update state with trimmed name, so that we never show a name with whitespace longer than we have to
        // i.e. the user has completed their typing by saving, confirming that they have finished typing the name
        this.setState({name: {
            ...this.state.name,
            value: trimmedName
        }});


        const validatedName = collectionValidation.name(trimmedName);
        if (!validatedName.isValid) {
            this.setState({
                name: {
                    value: trimmedName,
                    errorMsg: validatedName.errorMsg
                }
            });
            hasError = true;
        }

        if (this.state.publishType === "scheduled") {
            const validatedDate = collectionValidation.date(this.state.publishDate.value);
            if (!validatedDate.isValid) {
                this.setState({
                    publishDate: {
                        value: "",
                        errorMsg: validatedDate.errorMsg
                    }
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
                        errorMsg: validatedTime.errorMsg
                    }
                });
                hasError = true;
            }
        }

        if (hasError) {
            return;
        }

        this.setState({
            isSavingEdits: true
        });

        collections.update(this.props.id, this.mapEditsToAPIRequestBody({...this.state})).then(response => {
            const activeCollection = {
                ...this.props.activeCollection,
                name: response.name,
                publishDate: response.publishDate,
                type: response.type,
                teams: this.state.teams
            };
            const allCollections = this.props.collections.map(collection => {
                if (collection.id !== this.props.id) {
                    return collection;
                }
                return collectionMapper.collectionResponseToState(activeCollection);
            });
            this.props.dispatch(updateActiveCollection(activeCollection));
            this.props.dispatch(updatePagesInActiveCollection(activeCollection));
            this.props.dispatch(addAllCollections(allCollections));
            this.props.dispatch(push(url.resolve('../')));
        }).catch(error => {
            this.setState({
                isSavingEdits: false
            });
            switch (error.status) {
                case(400): {
                    const notification = {
                        type: "warning",
                        message: `The values you provided couldn't be saved. Please check for any possible errors and try again.`,
                        isDismissable: true,
                        autoDismiss: 4000
                    }
                    notifications.add(notification);
                    break;
                }
                case(401): {
                    // handled by request utility function
                    break;
                }
                case(403): {
                    const notification = {
                        type: "neutral",
                        message: `You don't have permission to edit the collection '${this.props.name}'`,
                        isDismissable: true,
                        autoDismiss: 4000
                    }
                    notifications.add(notification);
                    this.props.dispatch(push(url.resolve('/collections')));
                    break;
                }
                case(404): {
                    const notification = {
                        type: "neutral",
                        message: `Collection '${this.props.name}' no longer exists, so you've been redirected to the main collections screen`,
                        isDismissable: true,
                        autoDismiss: 4000
                    }
                    notifications.add(notification);
                    this.props.dispatch(push(url.resolve('/collections')));
                    break;
                }
                case(409): {
                    log.add(eventTypes.runtimeWarning, {message: "409 response because there was an attempt to rename collection to existing collection name: " + this.props.name + "->" + this.state.name.value});
                    this.setState(state => ({
                        name: {
                            value: state.name.value,
                            errorMsg: "A collection with this name already exists"
                        }
                    }));
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occured whilst saving the edits to collection '${this.props.name}'`,
                        isDismissable: true,
                        autoDismiss: 4000
                    }
                    notifications.add(notification);
                    break;
                }
            }
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error saving collection details for collection " + this.props.id + ". Error: " + JSON.stringify(error)});
            console.error("Error saving collection details update", error);
        });
    }

    teamsHaveChanged(state) {
        if (state.addedTeams.size > 0 || state.removedTeams.size > 0) {
            return true;
        }

        return false;
    }

    publishDateHasChanged(state) {
        if (state.publishType ===  "manual") {
            return false;
        }

        try {
            const newPublishDate = new Date(state.publishDate.value + " " + state.publishTime.value).toISOString();
            if (newPublishDate !== this.props.publishDate) {
                return true;
            }
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error creating new publish date from string: " + error});
            console.error("Error creating new publish date from string: " + error);
            return false;
        }

        return false;
    }

    mapEditsToAPIRequestBody(state) {
        let body = {};
        
        if (state.name.value !== this.props.name) {
            body.name = state.name.value;
        }

        if (this.teamsHaveChanged(state)) {
            // Switch the teams array of objects back to an array of strings.
            // Basically, we read from teamsDetails but write to teams, so not to 
            // break what Zebedee is expecting but still be able to use the team IDs
            body.teams = state.teams.map(team => (team.name));
        }

        if (state.publishType !== this.props.publishType) {
            body.type = state.publishType;
        }

        if (this.publishDateHasChanged(state)) {
            body.publishDate = state.publishType === "scheduled" ? new Date(state.publishDate.value + " " + state.publishTime.value).toISOString() : "";
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
                onNameBlur={this.handleNameBlur}
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
                teams={this.state.teams || []}
                allTeams={this.state.isFetchingAllTeams ? [] : this.props.allTeams}
                isFetchingAllTeams={this.state.isFetchingAllTeams}
                isSavingEdits={this.state.isSavingEdits}
            />
        )
    }
}

CollectionEditController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        allTeams: state.state.teams.allIDsAndNames,
        teams: state.state.collections.active ? state.state.collections.active.teams : undefined,
        publishType: state.state.collections.active ? state.state.collections.active.type : undefined,
        publishDate: state.state.collections.active ? state.state.collections.active.publishDate : undefined,
        activeCollection: state.state.collections.active,
        collections: state.state.collections.all
    }
}

export default connect(mapStateToProps)(CollectionEditController);