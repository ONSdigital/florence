import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import teams from '../../../utilities/api-clients/teams';
import { updateAllTeams } from '../../../config/actions';
import notifications from '../../../utilities/notifications';
import log from '../../../utilities/logging/log';

import TeamDeleteForm from './TeamDeleteForm';

const propTypes = {
    name: PropTypes.string.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string),
        path: PropTypes.string
    })),
    dispatch: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired
}

export class TeamDeleteController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formIsPosting: false,
            input: {
                value: "",
                error: ""
            },
            parentPath: (this.props.pathname).substr(0, this.props.pathname.lastIndexOf('/delete'))
        }

        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleCancel() {
        this.props.dispatch(push(this.state.parentPath));
    }

    handleFormInput(event) {
        const input = Object.assign({}, this.state.input, {
               value: event.target.value,
               error: ""
            });
        this.setState({input});
    }
    
    handleFormSubmit(event) {
        event.preventDefault()
        if (this.state.input.value !== this.props.name) {
            log.event(`error deleting team. The team name provided doesn't match the one user is trying to delete`, log.data({user_inputted_value: this.state.input.value, team: this.props.name}));
            const input = Object.assign({}, this.state.input, {
               error: "The team name you've provided doesn't match the one you're trying to delete" 
            });
            this.setState({input});
            return;
        }

        this.setState({formIsPosting: true});
        teams.remove(this.props.name).then(() => {
            // May want to update instantly with local version straight away and then allow 
            // teams controller to decide whether it wants to fetch teams from server again and update Redux
            const newTeams = this.props.teams.filter(team => {
                return team.name !== this.props.name;
            })
            this.props.dispatch(updateAllTeams(newTeams));
            this.props.onDeleteSuccess();
            log.event(`successfully deleted team`,log.data({team: this.props.name}));
        }).catch(error => {
            log.event(`Error deleting team`,log.data({status_code: error.status, team: this.props.name}), log.error(error));
            this.setState({formIsPosting: false});
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
                        message: `An error occurred whilst trying to delete team '${this.props.name}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `A network error occurred whilst trying to delete team '${this.props.name}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred whilst trying to delete team '${this.props.name}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    log.event(`Unhandled error whilst deleteing team's`,log.data({status_code: error.status, team: this.props.name, user: userAttributes.email}), log.error(error));
                    const notification = {
                        type: "warning",
                        message: `An unexpected error occurred whilst trying to delete team '${this.props.name}'`,
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
        });
    }

    render() {
        return (
            <TeamDeleteForm
                name={this.props.name}
                onCancel={this.handleCancel}
                onFormInput={this.handleFormInput}
                onFormSubmit={this.handleFormSubmit}
                input={this.state.input}
                isDisabled={this.state.formIsPosting}
            />
        )
    }
}

TeamDeleteController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        name: state.state.teams.active.name,
        teams: state.state.teams.all,
        pathname: state.routing.locationBeforeTransitions.pathname
    }
}

export default connect(mapStateToProps)(TeamDeleteController);