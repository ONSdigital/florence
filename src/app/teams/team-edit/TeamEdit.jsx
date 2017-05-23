import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    updatingAllUsers: PropTypes.bool.isRequired,
    onMembersChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
}

class TeamEdit extends Component {
    constructor(props) {
        super(props);

        this.handleMembersChange = this.handleMembersChange.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.updatingAllUsers && nextProps.updatingAllUsers) {
            return false;
        }

        return true;
    }

    handleMembersChange(event) {
        const attributes = {
            email: event.target.getAttribute('data-email'),
            action: event.target.getAttribute('data-action')
        }
        this.props.onMembersChange(attributes);
    }

    render() {
        return (
            <div className="grid add-remove">
                <div className="grid__col-12">
                    <h1 className="add-remove__heading">Edit team: {this.props.name}</h1>
                </div>
                <div className="grid__col-6">
                    <div className="add-remove__col">
                        <h2 className="add-remove__col-heading">All users</h2>
                        {!this.props.updatingAllUsers ?
                            <ul className="add-remove__list list list--neutral">
                                {this.props.users.map((user, index) => {
                                    return (
                                        <li key={index} className="add-remove__item">
                                            <span className="add-remove__item-title">{user.email}</span>
                                            <button 
                                                onClick={this.handleMembersChange} 
                                                className="btn btn--positive" 
                                                data-email={user.email}
                                                data-action="add"
                                            >
                                                Add
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                            :
                            <div className="add-remove__loader loader loader--dark"></div>
                        }
                    </div>
                </div>
                <div className="grid__col-6">
                    <div className="add-remove__col add-remove__col--border-left">
                        <h2 className="add-remove__col-heading">Team members</h2>
                        <ul className="add-remove__list list list--neutral">
                        {this.props.members.length > 0 ?
                            this.props.members.map((member, index) => {
                                return (
                                    <li key={index} className="add-remove__item">
                                        <span className="add-remove__item-title">{member}</span>
                                        <button 
                                            onClick={this.handleMembersChange} 
                                            className="btn"  
                                            data-email={member}
                                            data-action="remove"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                )
                            })
                            :
                            <p>This team has no members</p>
                        }
                        </ul>
                    </div>
                </div>
                <div className="grid__col-12">
                    <div className="add-remove__footer">
                        <button className="btn btn--primary" onClick={this.props.onDone}>Done</button>
                    </div>
                </div>
            </div>
        )
    }
}

TeamEdit.propTypes = propTypes;

export default TeamEdit;
