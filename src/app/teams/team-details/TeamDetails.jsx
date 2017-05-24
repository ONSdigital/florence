import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    userIsAdmin: PropTypes.bool.isRequired,
    onEditMembers: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isShowingLoader: PropTypes.bool
}

class TeamDetails extends Component {
    constructor(props) {
        super(props);
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
                    {this.props.isShowingLoader &&
                            <div className="drawer__loader loader loader--dark"></div>}
                    {this.props.members &&
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