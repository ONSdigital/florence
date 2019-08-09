import React, { Component } from "react";
import PropTypes from "prop-types";

import TeamEditItem from "./TeamEditItem";
import Input from "../../../components/Input";

const propTypes = {
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    users: PropTypes.arrayOf(PropTypes.object),
    disabledUsers: PropTypes.array.isRequired,
    updatingAllUsers: PropTypes.bool.isRequired,
    updatingMembers: PropTypes.bool.isRequired,
    showingLoaders: PropTypes.bool,
    onUsersSearch: PropTypes.func,
    onMembersChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    searchTerm: PropTypes.string
};

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
        return this.props.users.length > 0 ? (
            <ul className="list list--neutral">
                {this.props.users.map((user, index) => {
                    return (
                        <TeamEditItem
                            key={index}
                            action="add"
                            onClick={this.props.onMembersChange}
                            email={user.email}
                            isDisabled={this.props.disabledUsers.indexOf(user.email) !== -1}
                        />
                    );
                })}
            </ul>
        ) : (
            <p className="add-remove__text">
                {this.props.searchTerm.length > 0 ? (
                    <span>
                        No users match the term "<strong>{this.props.searchTerm}</strong>"
                    </span>
                ) : (
                    "No users to display"
                )}
            </p>
        );
    }

    renderMembers() {
        return this.props.members.length > 0 ? (
            <ul className="list list--neutral">
                {this.props.members.map((member, index) => {
                    return (
                        <TeamEditItem
                            key={index}
                            action="remove"
                            onClick={this.props.onMembersChange}
                            email={member}
                            isDisabled={this.props.disabledUsers.indexOf(member) !== -1}
                        />
                    );
                })}
            </ul>
        ) : (
            <p className="add-remove__text">This team has no members</p>
        );
    }

    render() {
        return (
            <div className="grid add-remove">
                <div className="grid__col-12">
                    <h1 className="add-remove__heading">Edit team: {this.props.name}</h1>
                </div>
                <div className="grid__col-6">
                    <div className="add-remove__col">
                        <div className="grid add-remove__col-heading">
                            <h2 className="grid__col-6">All users</h2>
                            <div className="grid__col-6 add-remove__search">
                                <Input id="users-search" label="Search for an email address" inline={true} onChange={this.props.onUsersSearch} />
                            </div>
                        </div>
                        <div className="add-remove__body ">
                            {!this.props.updatingAllUsers && this.renderUsers()}
                            {this.props.showingLoaders && <div className="add-remove__loader loader loader--dark"></div>}
                        </div>
                    </div>
                </div>
                <div className="grid__col-6">
                    <div className="add-remove__col add-remove__col--border-left">
                        <h2 className="add-remove__col-heading">Team members</h2>
                        <div className="add-remove__body">
                            {!this.props.updatingAllUsers && this.renderMembers()}
                            {this.props.showingLoaders && <div className="add-remove__loader loader loader--dark"></div>}
                        </div>
                    </div>
                </div>
                <div className="grid__col-12">
                    <div className="add-remove__footer">
                        <button className="btn btn--primary" onClick={this.props.onDone} disabled={this.props.disabledUsers.size > 0}>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

TeamEdit.propTypes = propTypes;

export default TeamEdit;
