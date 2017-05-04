import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateAllTeams, updateActiveTeam } from '../config/actions';
import teams from '../utilities/teams';
import safeURL from '../utilities/safeURL';

import SelectableBoxController from '../components/selectable-box/SelectableBoxController';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeTeam: PropTypes.object,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.object
}

class TeamsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdatingAllTeams: false
        };

        this.handleTeamClick = this.handleTeamClick.bind(this);
    }

    componentWillMount() {
        this.setState({isUpdatingAllTeams: true});
        teams.getAll().then(allTeams => {
            // Add any props (such as isSelected) to response from API
            const allTeamsWithProps = allTeams.map(team => {
                const path = safeURL(team.name + "_" + team.id);
                return Object.assign({}, team, {
                    path: path,
                    isSelected: path === this.props.params.team ? true : false
                });
            });
            this.props.dispatch(updateAllTeams(allTeamsWithProps));
            this.setState({isUpdatingAllTeams: false});
        });
    }

    shouldComponentUpdate(nextProps) {
        // const activeTeam = nextProps.allTeams.find(team => {
        //     return team.path === nextProps.params.team;
        // });
        // if (activeTeam) {
        //     this.props.dispatch(updateActiveTeam(activeTeam));
        // }
        return true;
    }

    handleTeamClick(clickedTeam) {
        const allTeams = this.props.allTeams.map(team => {
            // Deselect currently selected team
            if (team.isSelected) {
                return Object.assign({}, team, {
                    isSelected: !team.isSelected
                })
            }

            if (team.id !== clickedTeam.id) {
                return team;
            }

            // Toggle clicked item isSelected bool if it is already selected
            if (clickedTeam.isSelected) {
                return Object.assign({}, team, {
                    isSelected: !team.isSelected
                })
            }

            // Toggled isSelected bool on selected item
            return Object.assign({}, team, {
                isSelected: !team.isSelected
            })
        });
        const path = safeURL(clickedTeam.name + "_" + clickedTeam.id);
        this.props.dispatch(push(`${this.props.rootPath}/teams/${path}`));
        this.props.dispatch(updateAllTeams(allTeams));
    }

    render() {
        return (
            <div className="grid grid--justify-space-around">
                <div className="grid__col-4">
                    <h1>Select a team</h1>
                    <SelectableBoxController 
                        items={this.props.allTeams} 
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