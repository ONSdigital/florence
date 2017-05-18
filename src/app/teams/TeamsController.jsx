import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateAllTeams, updateActiveTeam, emptyActiveTeam } from '../config/actions';
import teams from '../utilities/teams';
import safeURL from '../utilities/safeURL';

import SelectableBoxController from '../components/selectable-box/SelectableBoxController';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeTeam: PropTypes.object,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired
}

export class TeamsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdatingAllTeams: false
        };

        this.handleTeamClick = this.handleTeamClick.bind(this);
    }

    componentWillMount() {
        this.fetchTeams();
    }

    componentWillReceiveProps(nextProps) {
        // Update with new active team
        const activeTeam = nextProps.allTeams.find(team => {
            return team.path === nextProps.params.team;
        });
        if (activeTeam && nextProps.activeTeam !== activeTeam && !this.state.isUpdatingAllTeams) {
            this.props.dispatch(updateActiveTeam(activeTeam));
            return;
        }
        
        // No active team in parameter anymore
        if (!nextProps.params.team && nextProps.activeTeam && nextProps.activeTeam.id) {
            this.props.dispatch(emptyActiveTeam());
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Don't update component if all teams haven't been fetched yet
        if (!nextProps.allTeams) {
            return false;
        }

        // No change to props or state that needs to be rendered
        if (this.props.allTeams === nextProps.allTeams && this.props.activeTeam === nextProps.activeTeam && !this.state.isUpdatingAllTeams) {
            return false;
        }

        // Component is still fetching teams - don't render any changes
        if (nextState.isUpdatingAllTeams) {
            return false;
        }

        return true;
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
        )
    }
}

TeamsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        activeTeam: state.state.teams.active,
        allTeams: state.state.teams.all,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(TeamsController);