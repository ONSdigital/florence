import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateAllTeams, updateActiveTeam, emptyActiveTeam } from '../config/actions';
import teams from '../utilities/teams';
import safeURL from '../utilities/safeURL';

import SelectableBoxController from '../components/selectable-box/SelectableBoxController';
import Drawer from '../components/drawer/Drawer';
import TeamDetails from './TeamDetails';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeTeam: PropTypes.object,
    rootPath: PropTypes.string.isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired
}

export class TeamsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdatingAllTeams: false,
            drawerIsAnimatable: false,
            clearActiveTeam: false
        };

        this.handleTeamClick = this.handleTeamClick.bind(this);
        this.handleDrawerTransitionEnd = this.handleDrawerTransitionEnd.bind(this);
        this.handleDrawerCancelClick = this.handleDrawerCancelClick.bind(this);
    }

    componentWillMount() {
        this.fetchTeams();

        // Remove anything data left in activeTeam object from previous instance of Teams screen
        if (this.props.activeTeam && this.props.activeTeam.id && !this.props.params.team) {
            this.props.dispatch(emptyActiveTeam());
        }
    }

    componentWillReceiveProps(nextProps) {
        // Update with new active team
        const activeTeam = nextProps.allTeams.find(team => {
            return team.path === nextProps.params.team;
        });
        if (activeTeam && (nextProps.activeTeam !== activeTeam) && !this.state.isUpdatingAllTeams) {
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
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Allow render because drawer animtation flag has changed
        if (this.state.drawerIsAnimatable !== nextState.drawerIsAnimatable) {
            return true;
        }

        // Don't update component if all teams haven't been fetched yet
        if (!nextProps.allTeams) {
            return false;
        }

        // No change to props or state that needs to be rendered
        if ((this.props.allTeams === nextProps.allTeams) && (this.props.activeTeam === nextProps.activeTeam) && !this.state.isUpdatingAllTeams) {
            return false;
        }

        // Component is still fetching teams - don't render any changes
        if (nextState.isUpdatingAllTeams) {
            return false;
        }

        return true;
    }

    handleDrawerTransitionEnd() {
        this.setState({drawerIsAnimatable: false});
        
        if (this.state.clearActiveTeam) {
            this.setState({clearActiveTeam: false});
            this.props.dispatch(emptyActiveTeam());
        }
    }

    handleDrawerCancelClick() {
        this.props.dispatch(push(`${this.props.rootPath}/teams`));
        
    }

    fetchTeams() {
        this.setState({isUpdatingAllTeams: true});
        teams.getAll().then(allTeams => {
            // Add any props (such as isSelected) to response from API
            const allTeamsWithProps = allTeams.map(team => {
                const path = safeURL(team.name + "_" + team.id);
                return Object.assign({}, team, {
                    path: path
                });
            });
            
            // Update all teams and active team
            const teamParameter = this.props.params.team;
            this.props.dispatch(updateAllTeams(allTeamsWithProps));
            if (teamParameter) {
                const activeTeam = allTeamsWithProps.find(team => {
                    return team.path === teamParameter;
                });
                this.props.dispatch(updateActiveTeam(activeTeam));
            }

            this.setState({isUpdatingAllTeams: false});
        });
    }

    handleTeamClick(clickedTeam) {
        // Make no change if clicked team is already the selected team
        if (clickedTeam.isSelected) {
            return;
        }
        const path = safeURL(clickedTeam.name + "_" + clickedTeam.id);
        this.props.dispatch(push(`${this.props.rootPath}/teams/${path}`));
    }

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a team</h1>
                        <SelectableBoxController 
                            items={this.props.allTeams}
                            activeItem={this.props.activeTeam}
                            isUpdating={this.state.isUpdatingAllTeams} 
                            heading="Name"
                            handleItemClick={this.handleTeamClick}
                        />
                    </div>
                    <div className="grid__col-4">
                        <h1>Create a team</h1>
                    </div>
                </div>
                <Drawer
                    isVisible={this.props.activeTeam && this.props.activeTeam.id && !this.state.clearActiveTeam && this.props.params.team ? true : false} 
                    isAnimatable={this.state.drawerIsAnimatable} 
                    handleTransitionEnd={this.handleDrawerTransitionEnd}
                >
                    {
                        this.props.activeTeam && this.props.activeTeam.id ?
                            <TeamDetails {...this.props.activeTeam} userIsAdmin={this.props.userIsAdmin} onCancel={this.handleDrawerCancelClick} />
                            :
                            ""
                    }
                </Drawer>
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