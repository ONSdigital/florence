import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CollectionEdit from './CollectionEdit';
import url from '../../../utilities/url';
import teams from '../../../utilities/api-clients/teams';
import log, {eventTypes} from '../../../utilities/log';
import notifications from '../../../utilities/notifications';
import { updateAllTeamIDsAndNames , updateAllTeams} from '../../../config/actions';

const propTypes = {
    name: PropTypes.string.isRequired,
    dispatch: PropTypes.func,
    allTeams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })),
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }))
};

export class CollectionEditController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingEdits: false,
            isFetchingAllTeams: false,
            name: {
                value: this.props.name,
                errorMsg: ""
            },
            teams: this.props.teams
        }

        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTeamSelection = this.handleTeamSelection.bind(this);
        this.handleRemoveTeam = this.handleRemoveTeam.bind(this);
    }

    componentWillMount() {
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

    handleNameChange() {
        if (this.state.name.errorMsg) {
            this.setState(state => ({
                name: {
                    value: state.name.value,
                    errorMsg: ""
                }
            }));
        }
    }

    handleTeamSelection(teamID) {
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
        this.setState(state => ({
            teams: [...state.teams, selectedTeam]
        }));
    }

    handleRemoveTeam(removedTeam) {
        this.setState(state => ({
            teams: state.teams.filter(team => {
                return team.id !== removedTeam.id
            })
        }));
    }

    handleCancel() {
        this.props.dispatch(push(url.resolve('../')));
    }

    handleSave(formState) {
        let hasError = false;
        
        //TODO possibly share validation between here and create collection component
        if (!formState.name) {
            this.setState(state => ({
                name: {
                    ...state.name,
                    errorMsg: "Collections must be given a name"
                }
            }));
            hasError = true;
        }

        if (hasError) {
            return;
        }

        this.props.dispatch(push(url.resolve('../')));
    }

    render() {
        return (
            <CollectionEdit 
                {...this.props}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
                onNameChange={this.handleNameChange}
                onTeamSelect={this.handleTeamSelection}
                onRemoveTeam={this.handleRemoveTeam}
                name={this.state.name.value}
                nameErrorMsg={this.state.name.errorMsg}
                teams={this.state.teams || []}
                allTeams={this.state.isFetchingAllTeams ? [] : this.props.allTeams}
                isFetchingAllTeams={this.state.isFetchingAllTeams}
            />
        )
    }
}

CollectionEditController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        allTeams: state.state.teams.allIDsAndNames,
        teams: state.state.collections.active ? state.state.collections.active.teams : undefined
    }
}

export default connect(mapStateToProps)(CollectionEditController);