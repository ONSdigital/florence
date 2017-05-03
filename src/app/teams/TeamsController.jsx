import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateAllTeams } from '../config/actions';
import teams from '../utilities/teams';

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
    }

    componentWillMount() {
        this.setState({isUpdatingAllTeams: true});
        teams.getAll().then(allTeams => {
            this.props.dispatch(updateAllTeams(allTeams.teams));
            this.setState({isUpdatingAllTeams: false});
        });
    }

    renderAllTeams() {
        const listOfTeams = this.props.allTeams.map(team => {
            return (
                <li key={team.id}>{team.name}</li>
            )
        });
        const teams = <ul>{listOfTeams}</ul>
        return teams;
    }

    render() {
        return (
            <div>
                { this.state.isUpdatingAllTeams ? "Updating..." : "" }
                { this.renderAllTeams() }
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