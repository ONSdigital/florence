import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    userIsAdmin: PropTypes.bool.isRequired,
    onEditMembers: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isShowingLoader: PropTypes.bool,
    isReadOnly: PropTypes.bool
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
                {this.props.isReadOnly &&
                    <div className="drawer__banner drawer__banner--dark">
                        <h3>Read only</h3>
                        <p>The list of teams if still being fetched so you can't edit or delete a team</p>
                    </div>
                }
                {this.props.userIsAdmin && 
                    <div className="drawer__banner">
                        <button onClick={this.props.onEditMembers} disabled={this.props.isReadOnly} className="btn btn--primary">Add / remove members</button>
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
                    {this.props.userIsAdmin &&
                        <button 
                            className="btn btn--warning btn--margin-right" 
                            disabled={this.props.isReadOnly} 
                            onClick={this.props.onDelete}
                        >
                            Delete team
                        </button>
                    }
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}

TeamDetails.propTypes = propTypes;

export default TeamDetails;