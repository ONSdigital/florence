import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { 
    updateAllTeams, 
    updateActiveTeam, 
    emptyActiveTeam, 
    updateActiveTeamMembers
} from '../../config/actions';
import teams from '../../utilities/api-clients/teams';
import url from '../../utilities/url';
import notifications from '../../utilities/notifications';
import log from '../../utilities/newLog.ts';

import SelectableBoxController from '../../components/selectable-box/SelectableBoxController';
import Drawer from '../../components/drawer/Drawer';
import TeamCreate from './team-create/TeamCreate';
import TeamDetails from './team-details/TeamDetails';
import TeamEditController from './team-edit/TeamEditController';
import TeamDeleteController from './team-delete/TeamDeleteController';
import Modal from '../../components/Modal';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeTeam: PropTypes.object,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired
}

export class TeamsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdatingAllTeams: false,
            isUpdatingTeamMembers: false,
            drawerIsAnimatable: false,
            clearActiveTeam: false,
            isEditingTeam: false,
            isDeletingTeam: false
        };

        this.handleTeamClick = this.handleTeamClick.bind(this);
        this.handleMembersEditClick = this.handleMembersEditClick.bind(this);
        this.handleDrawerTransitionEnd = this.handleDrawerTransitionEnd.bind(this);
        this.handleDrawerCancelClick = this.handleDrawerCancelClick.bind(this);
        this.handleTeamDeleteClick = this.handleTeamDeleteClick.bind(this);
        this.handleTeamDeleteSuccess = this.handleTeamDeleteSuccess.bind(this);
        this.handleTeamCreateSuccess = this.handleTeamCreateSuccess.bind(this);
    }

    componentWillMount() {
        this.fetchTeams();
    }

    componentWillReceiveProps(nextProps) {
        // Update with new active team
        const activeTeam = nextProps.allTeams.find(team => {
            return team.path === nextProps.params.team;
        });
        if (activeTeam && (nextProps.activeTeam.id !== activeTeam.id)) {
            this.fetchMembers(activeTeam.name);

            if (!this.props.params.team) {
                this.setState({drawerIsAnimatable: true});   
            }

            this.props.dispatch(updateActiveTeam(activeTeam));
            return;
        }
        
        // No active team in parameter anymore
        if (!nextProps.params.team && nextProps.activeTeam && nextProps.activeTeam.id) {
            this.setState({
                drawerIsAnimatable: true,
                clearActiveTeam: true
            });
        }

        // Open edit team modal
        if (nextProps.routes[nextProps.routes.length-1].path === "edit") {
            this.setState({isEditingTeam: true});
        }

        // Open delete team modal
        if (nextProps.routes[nextProps.routes.length-1].path === "delete") {
            this.setState({isDeletingTeam: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Allow render because drawer animtation flag has changed
        if (this.state.drawerIsAnimatable !== nextState.drawerIsAnimatable) {
            return true;
        }

        // Allow render because the team editing modal is being displayed
        if (nextProps.routes[nextProps.routes.length-1].path === "edit" && nextState.isEditingTeam) {
            return true;
        }
        
        // Allow render because the team editing modal is being displayed
        if (nextProps.routes[nextProps.routes.length-1].path === "delete" && nextState.isDeletingTeam) {
            return true;
        }

        // Don't update component if all teams haven't been fetched yet
        if (!nextProps.allTeams) {
            return false;
        }

        // Component is still fetching teams and we don't have teams in Redux yet - don't render any changes
        if (nextState.isUpdatingAllTeams && (nextProps.allTeams.length === 0)) {
            return false;
        }

        return true;
    }

    componentWillUnmount() {
        this.props.dispatch(emptyActiveTeam());
    }

    handleDrawerTransitionEnd() {
        this.setState({drawerIsAnimatable: false});
        
        if (this.state.clearActiveTeam) {
            this.setState({clearActiveTeam: false});
            this.props.dispatch(emptyActiveTeam());
        }
    }

    handleMembersEditClick() {
        this.props.dispatch(push(`${location.pathname}/edit`));
    }

    handleDrawerCancelClick() {
        this.props.dispatch(push(url.resolve("../")));
    }

    handleTeamDeleteClick() {
        this.props.dispatch(push(`${location.pathname}/delete`));
    }

    handleTeamDeleteSuccess() {
        this.props.dispatch(push(url.resolve("../../")));
        const notification = {
            type: 'positive',
            message: `Team '${this.props.activeTeam.name}' successfully deleted`,
            isDismissable: true,
            autoDismiss: 15000
        }
        notifications.add(notification);
        this.fetchTeams();
    }

    handleTeamCreateSuccess() {
        this.fetchTeams();
    }

    fetchTeams() {
        this.setState({isUpdatingAllTeams: true});
        teams.getAll().then(allTeams => {
            // Add any props (such as 'path') to response from API
            const allTeamsWithProps = allTeams.map(team => {
                const path = url.sanitise(team.name + "_" + team.id);
                return Object.assign({}, team, {
                    path: path
                });
            });
            
            // Update all teams
            const teamParameter = this.props.params.team;
            this.props.dispatch(updateAllTeams(allTeamsWithProps));
            this.setState({isUpdatingAllTeams: false});

            // Update active team
            if (teamParameter) {
                const activeTeam = allTeamsWithProps.find(team => {
                    return team.path === teamParameter;
                });
                // Only update Redux if new active team is different from the current one
                if (activeTeam && activeTeam !== this.props.activeTeam ) {
                    this.props.dispatch(updateActiveTeam(activeTeam));
                    return;
                }
                // Give error because the team in the URL can't be found in the data
                if (!activeTeam) {
                    const notification = {
                        message: `Team '${teamParameter}' is not recognised so you've been redirected to the teams screen`,
                        type: "neutral",
                        autoDismiss: 15000,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    this.props.dispatch(push(url.resolve("../")));
                }
            }
        }).catch(error => {
            log.event(`Error fetching teams`,log.data({'status_code': error.status}), log.error(error));
            switch(error.status) {
                case(401): {
                    // This is handled by the request function, so do nothing here
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to get teams. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get teams. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get teams. You may only be able to see previously loaded information and not be able to edit any team members",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    log.event(`Unhandled error fetching teams`,log.data({'status_code': error.status}), log.error(error));
                    const notification = {
                        type: "warning",
                        message: "There's been an error fetching the teams. You may only be able to see previously loaded information.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
        });
    }

    fetchMembers(teamName) {
        this.setState({isUpdatingTeamMembers: true});
        teams.get(teamName).then(team => {
            // A new team is now active, don't do anything with the fetched data
            if (teamName !== this.props.activeTeam.name) {
                return;
            }
            
            this.props.dispatch(updateActiveTeamMembers(team.members));
            this.setState({isUpdatingTeamMembers: false});
        }).catch(error => {
            log.event(`Error fetching members of team`,log.data({'status_code': error.status, "team": teamName}), log.error(error));
            switch(error.status) {
                case(404): {
                    const notification = {
                        type: "warning",
                        message: `Couldn't find members for the team: '${teamName}'. This team may have been deleted.`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `An error's occurred whilst trying to get the members for the team '${teamName}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error's occurred whilst trying to get the members for the team '${teamName}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `There's been a network error whilst trying to get the members for the team '${teamName}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                default: {
                    log.event(`Unhandled error fetching team`,log.data({'status_code': error.status, "team": teamName}), log.error(error));
                    const notification = {
                        type: "warning",
                        message: "There's been an error fetching the members of team '${teamName}'",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
        });
    }

    handleTeamClick(clickedTeam) {
        // Make no change if clicked team is already the selected team
        if (clickedTeam.isSelected) {
            return;
        }
        const path = url.sanitise(clickedTeam.name + "_" + clickedTeam.id);
        this.props.dispatch(push(`${this.props.rootPath}/teams/${path}`));
    }

    renderDrawer() {
        return (
            <Drawer
                isVisible={this.props.activeTeam && this.props.activeTeam.id && !this.state.clearActiveTeam ? true : false} 
                isAnimatable={this.state.drawerIsAnimatable} 
                handleTransitionEnd={this.handleDrawerTransitionEnd}
            >
                {
                    this.props.activeTeam && this.props.activeTeam.id ?
                        <TeamDetails 
                            {...this.props.activeTeam} 
                            userIsAdmin={this.props.userIsAdmin} 
                            onCancel={this.handleDrawerCancelClick}
                            onDelete={this.handleTeamDeleteClick}
                            onEditMembers={this.handleMembersEditClick}
                            isShowingLoader={this.state.isUpdatingTeamMembers}
                            isReadOnly={this.state.isUpdatingAllTeams}
                        />
                        :
                        ""
                }
            </Drawer>
        )
    }

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1 className="text-center">Select a team</h1>
                        <SelectableBoxController 
                            items={this.props.allTeams}
                            activeItem={this.props.activeTeam}
                            isUpdating={this.state.isUpdatingAllTeams} 
                            heading="Name"
                            handleItemClick={this.handleTeamClick}
                        />
                    </div>
                    <div className="grid__col-4">
                        <h1 className="text-center">Create a team</h1>
                        <TeamCreate onCreateSuccess={this.handleTeamCreateSuccess} />
                    </div>
                </div>
                {this.renderDrawer()}
                {
                    this.props.routes[this.props.routes.length-1].path === "edit" && this.props.activeTeam && this.props.activeTeam.id ?
                    <Modal sizeClass="grid__col-8">
                        <TeamEditController isUpdatingMembers={this.state.isUpdatingTeamMembers}/>
                    </Modal>
                    :
                    ""
                }
                {
                    this.props.routes[this.props.routes.length-1].path === "delete" && this.props.activeTeam && this.props.activeTeam.id ?
                    <Modal sizeClass="grid__col-3">
                        <TeamDeleteController name={this.props.activeTeam.name} onDeleteSuccess={this.handleTeamDeleteSuccess}/>
                    </Modal>
                    :
                    ""
                }
            </div>
        )
    }
}

TeamsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        activeTeam: state.state.teams.active,
        allTeams: state.state.teams.all,
        userIsAdmin: state.state.user.isAdmin,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(TeamsController);