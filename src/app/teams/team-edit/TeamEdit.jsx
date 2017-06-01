import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TeamEditItem from './TeamEditItem';

const propTypes = {
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    users: PropTypes.arrayOf(PropTypes.object),
    disabledUsers: PropTypes.object.isRequired,
    updatingAllUsers: PropTypes.bool.isRequired,
    updatingMembers: PropTypes.bool.isRequired,
    showingLoaders: PropTypes.bool,
    onMembersChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
}

class TeamEdit extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.updatingAllUsers && nextProps.updatingAllUsers) {
            return false;
        }

        return true;
    }

    renderUsers() {
        return (
            <ul className="list list--neutral">
                {this.props.users.map((user, index) => {
                    return (
                        <TeamEditItem 
                            key={index} 
                            action="add"
                            onClick={this.props.onMembersChange}
                            email={user.email}
                            isDisabled={this.props.disabledUsers.has(user.email)}
                        />
                    )
                })}
            </ul>
        )
    }

    renderMembers() {
        return (
            this.props.members.length > 0 ?
                <ul className="list list--neutral">
                    {this.props.members.map((member, index) => {
                        return (
                            <TeamEditItem 
                                key={index} 
                                action="remove" 
                                onClick={this.props.onMembersChange}
                                email={member}
                                isDisabled={this.props.disabledUsers.has(member)}
                            />
                        )
                    })}
                </ul>
            :
                <p>This team has no members</p>
        )
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
                        <div className="add-remove__body ">
                            {!this.props.updatingAllUsers &&
                                this.renderUsers()
                            }
                            {this.props.showingLoaders && 
                                <div className="add-remove__loader loader loader--dark"></div>
                            }
                        </div>
                    </div>
                </div>
                <div className="grid__col-6">
                    <div className="add-remove__col add-remove__col--border-left">
                        <h2 className="add-remove__col-heading">Team members</h2>
                        <div className="add-remove__body">
                            {!this.props.updatingAllUsers &&
                                this.renderMembers()
                            }
                            {this.props.showingLoaders && 
                                <div className="add-remove__loader loader loader--dark"></div>
                            }
                        </div>
                    </div>
                </div>
                <div className="grid__col-12">
                    <div className="add-remove__footer">
                        <button 
                            className="btn btn--primary" 
                            onClick={this.props.onDone}
                            disabled={this.props.disabledUsers.size > 0}
                        >   
                            Done
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

TeamEdit.propTypes = propTypes;

export default TeamEdit;
