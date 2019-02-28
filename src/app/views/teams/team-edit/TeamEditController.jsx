import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import { updateActiveTeamMembers, addAllUsers } from '../../../config/actions';
import user from '../../../utilities/api-clients/user';
import teams from '../../../utilities/api-clients/teams';
import notifications from '../../../utilities/notifications';
import log from '../../../utilities/logging/log';

import TeamEdit from './TeamEdit';

const propTypes = {
    name: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    members: PropTypes.arrayOf(PropTypes.string),
    isUpdatingMembers: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

export class TeamEditController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editedUsers: null,
            updatingAllUsers: false,
            parentPath: (location.pathname).split('/edit')[0],
            disabledUsers: [],
            searchTerm: ""
        }

        this.handleUsersSearch = this.handleUsersSearch.bind(this);
        this.handleMembersChange = this.handleMembersChange.bind(this);
        this.handleDone = this.handleDone.bind(this);
    }

    componentWillMount() {
        this.setState({
            updatingAllUsers: true
        });
        user.getAll().then(users => {
            const editedUsers = users.filter(user => {
                return this.props.members.indexOf(user.email) < 0
            });
            
            this.props.dispatch(addAllUsers(users));
            this.setState({
                editedUsers,
                updatingAllUsers: false
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.users !== this.props.users) {
            this.setState({editedUsers: nextProps.users})
        }
    }

    handleUsersSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredUsers = this.props.users.filter(user => {
            const isTeamMember = this.props.members.some(member => {
                return member === user.email
            });
            return (
                user.email.toLowerCase().search(searchTerm) !== -1 
                && 
                !isTeamMember
            );
        });
        this.setState({
            editedUsers: filteredUsers,
            searchTerm
        });
    }

    sortUsers(users) {
        return users.sort((userA, userB) => {
            if (userA.email < userB.email) return -1;
            if (userA.email > userB.email) return 1;
            return 0;
        });
    }

    sortMembers(members) {
        return members.sort((memberA, memberB) => {
            if (memberA < memberB) return -1;
            if (memberA > memberB) return 1;
            return 0;
        });
    }

    handleMembersChange(userAttributes) {
        log.event("Updateing user in team", log.data({action: userAttributes.action, team: this.props.name, user: userAttributes.email}))

        const disabledUsers = [...this.state.disabledUsers, userAttributes.email];
        this.setState({disabledUsers});

        switch (userAttributes.action) {
            case ("remove"): {
                teams.removeMember(this.props.name, userAttributes.email).then(() => {
                    const editedMembers = this.props.members.filter(member => {
                        return member !== userAttributes.email
                    });
                    const editedUsers = [ ...this.state.editedUsers, {email: userAttributes.email}];
                    const disabledUsers = [...this.state.disabledUsers];
                    disabledUsers.splice(disabledUsers.indexOf(userAttributes.email), 1);

                    this.setState({
                        editedUsers: this.sortUsers(editedUsers),
                        disabledUsers
                    });
                    log.event(`Successfully removed user from team`,log.data({team: this.props.name, user: userAttributes.email}));
                    this.props.dispatch(updateActiveTeamMembers(this.sortMembers(editedMembers)));
                }).catch(error => {
                    log.event(`Error removing user`,log.data({status_code: error.status, team: this.props.name, user: userAttributes.email}), log.error(error));
                    const disabledUsers = [...this.state.disabledUsers];
                    disabledUsers.splice(disabledUsers.indexOf(userAttributes.email), 1);
                    this.setState({disabledUsers});
                    
                    switch(error.status) {
                        case(401): {
                            // do nothing - handled by request utility function
                            break;
                        }
                        case(404): {
                            const notification = {
                                type: "warning",
                                message: `The team '${this.props.name}' doesn't exist - another user may have deleted it`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("RESPONSE_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `An error occurred whilst trying to remove '${userAttributes.email}' from team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("FETCH_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `A network error occurred whilst trying to remove '${userAttributes.email}' from team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("UNEXPECTED_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `An unexpected error occurred whilst trying to remove '${userAttributes.email}' from team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        default: {
                            log.event(`Unhandled error removing user`,log.data({status_code: error.status, team: this.props.name, user: userAttributes.email}), log.error(error));
                            const notification = {
                                type: "warning",
                                message: `An unexpected error occurred whilst trying to remove '${userAttributes.email}' from team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break;
                        }
                    }
                });
                break;
            }
            case ("add"): {
                teams.addMember(this.props.name, userAttributes.email).then(() => {
                    const editedMembers = [ ...this.props.members, userAttributes.email];
                    const editedUsers = this.state.editedUsers.filter(user => {
                        return user.email !== userAttributes.email
                    });
                    const disabledUsers = [...this.state.disabledUsers];
                    disabledUsers.splice(disabledUsers.indexOf(userAttributes.email), 1);

                    this.setState({
                        editedUsers: this.sortUsers(editedUsers),
                        disabledUsers
                    });
                    log.event(`successfully added user to team`,log.data({team: this.props.name, user: userAttributes.email}));
                    this.props.dispatch(updateActiveTeamMembers(this.sortMembers(editedMembers)));
                }).catch(error => {
                    log.event(`Error adding user`,log.data({status_code: error.status, team: this.props.name, user: userAttributes.email}), log.error(error));
                    const disabledUsers = [...this.state.disabledUsers];
                    disabledUsers.splice(disabledUsers.indexOf(userAttributes.email), 1);
                    this.setState({disabledUsers});

                    switch(error.status) {
                        case(401): {
                            // do nothing - handled by request utility function
                            break;
                        }
                        case(404): {
                            const notification = {
                                type: "warning",
                                message: `The team '${this.props.name}' doesn't exist - another user may have deleted it`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("RESPONSE_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `An error occurred whilst trying to add '${userAttributes.email}' to team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("FETCH_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `A network error occurred whilst trying to add '${userAttributes.email}' to team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        case("UNEXPECTED_ERR"): {
                            const notification = {
                                type: "warning",
                                message: `An unexpected error occurred whilst trying to add '${userAttributes.email}' to team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break
                        }
                        default: {
                            log.event(`Unhandled error creating user`,log.data({status_code: error.status, team: this.props.name, user: userAttributes.email}), log.error(error));
                            const notification = {
                                type: "warning",
                                message: `An unexpected error occurred whilst trying to add '${userAttributes.email}' to team '${this.props.name}'`,
                                isDismissable: true
                            }
                            notifications.add(notification);
                            break;
                        }
                    }
                });
                break;
            }
        }
    }

    handleDone() {
        this.props.dispatch(push(this.state.parentPath));
    }

    render() {
        return (
            <TeamEdit 
                name={this.props.name}
                users={this.state.editedUsers} 
                members={this.props.members}
                onUsersSearch={this.handleUsersSearch}
                onMembersChange={this.handleMembersChange}
                onDone={this.handleDone}
                updatingAllUsers={this.state.updatingAllUsers}
                updatingMembers={this.props.isUpdatingMembers}
                showingLoaders={this.state.updatingAllUsers || this.props.isUpdatingMembers}
                disabledUsers={this.state.disabledUsers}
                searchTerm={this.state.searchTerm}
            />
        )
    }
}

TeamEditController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        name: state.state.teams.active.name,
        members: state.state.teams.active.members,
        rootPath: state.state.rootPath,
        users: state.state.users.all
    }
}

export default connect(mapStateToProps)(TeamEditController);
