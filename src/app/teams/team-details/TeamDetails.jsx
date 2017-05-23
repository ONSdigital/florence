import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    userIsAdmin: PropTypes.bool.isRequired,
    onEditMembers: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

class TeamDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingTeam: false
        };
    }

    componentWillMount() {
        // Members is currently fetched with all teams. TODO - only fetch team when TeamDetails component is mounted.
        // The code in this conditional is in preparation for this change being made to the API response.
        if (!this.props.members) {
            this.fetchTeam();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id && !this.props.members) {
            this.fetchTeam();
        }
    }

    fetchTeam() {
        // TODO - once API change is made edit this function to update Redux state activeTeam with team members
        // this.setState({isFetchingTeam: true});
        // teams.get(this.props.name).then(team => {
        //     this.dispatch(updateActiveTeam(team));
        //     this.setState({isFetchingTeam: false});
        // });
    }

    renderMembers() {
        const members = this.props.members;
        const list = (
            <ul className="list list--neutral">
                {members.map((member, index) => {
                    return <li className="list__item" key={index}>{member}</li>
                })}
            </ul>
        )
        return (members.length > 0) ? list : <p>This team has no members</p>
    }

    render() {
        return (
            <div className="drawer__container">
                <h2 className="drawer__heading">{this.props.name}</h2>
                    {
                        this.props.userIsAdmin && 
                            <div className="drawer__banner">
                                    <button onClick={this.props.onEditMembers} className="btn btn--primary">Add / remove members</button>
                            </div>
                    }
                <div className="drawer__body">
                    {
                        this.state.isFetchingTeam ? 
                            <div className="drawer__loader loader loader--large loader--dark"></div>
                        :
                            this.renderMembers()

                    }
                </div>
                <div className="drawer__footer">
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}

TeamDetails.propTypes = propTypes;

export default TeamDetails;