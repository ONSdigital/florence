import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateAllTeams } from '../config/actions';
import teams from '../utilities/teams';

import SelectableBoxController from '../components/selectable-box/SelectableBoxController';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    allTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeTeam: PropTypes.object.isRequired
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
            const allTeamsWithProps = allTeams.teams.map(team => {
                return Object.assign({}, team, {
                    isSelected: false
                });
            });
            this.props.dispatch(updateAllTeams(allTeamsWithProps));
            this.setState({isUpdatingAllTeams: false});
        });
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

            // Toggled isSelected bool on selected item
            return Object.assign({}, team, {
                isSelected: !team.isSelected
            })
        });
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
        allTeams: state.state.teams.all
    }
}

export default connect(mapStateToProps)(TeamsController);