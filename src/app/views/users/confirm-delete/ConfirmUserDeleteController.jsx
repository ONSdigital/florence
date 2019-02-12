import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import PropTypes from 'prop-types';
import Modal from  '../../../components/Modal';
import Input from '../../../components/Input';
import url from '../../../utilities/url';
import { removeUserFromAllUsers } from '../../../config/actions';
import user from '../../../utilities/api-clients/user';
import log from '../../../utilities/logging/log';
import notifications from '../../../utilities/notifications';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string.isRequired
    }).isRequired,
    loggedInUser: PropTypes.shape({
        isAdmin: PropTypes.bool.isRequired
    }).isRequired
};

export class ConfirmUserDeleteController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            error: "",
            isSavingDelete: false
        };
    }

    componentWillMount() {
        if (!this.props.loggedInUser.isAdmin) {
            this.props.dispatch(replace(url.resolve("../")));
        }
    }

    deleteUser(userID) {
        return new Promise(async (resolve, reject) => {
            user.remove(userID).then(response => {
                resolve({
                    response,
                    error: null
                });
            }).catch(error => reject(error));
        }).catch(error => {
            console.error(`Error deleting user '${userID}'`, error);
            log.event("Error deleting user", log.error(error), log.data({user_id: UserID}))
            return {
                response: null,
                error
            };
        });
    }

    handleDeleteUserError(error) {
        let notification = {
            type: "warning",
            isDismissable: true,
            message: ``
        };
        
        switch (error.status) {
            case(401): {
                // handled by utility 'request' function
                break;
            }
            case(403): {
                notification.message = `Unable to delete user because you do not have permission to do so`;
                break;
            }
            case(404): {
                notification.message = `Unable to delete user because it no longer exists`;
                break;
            }
            case('FETCH_ERR'): {
                notification.message = `Unable to delete user due to a network error. Check your connection and try again.`;
                break;
            }
            default: {
                notification.message = `Unable to delete user due to an unexpected error`;
                break;
            }
        }
        
        notifications.add(notification);
    }

    handleClose = () => {
        this.props.dispatch(push(url.resolve("../")));
    }

    handleChange = event => {
        this.setState({
            email: event.target.value,
            error: ""
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        const userID = this.props.params.userID;

        if (!this.state.email) {
            this.setState({
                error: `You must enter the user's email address`
            });
            return;
        }

        if (this.state.email !== userID) {
            this.setState({
                error: `Email address must match '${userID}'`
            });
            return;
        }

        this.setState({isSavingDelete: true});
        const response = await this.deleteUser(userID);
        this.setState({isSavingDelete: false});

        if (response.error) {
            this.handleDeleteUserError(response.error);
            return;
        }

        notifications.add({
            type: "positive",
            message: "User successfully deleted",
            autoDismiss: 7000,
            isDismissable: true
        });
        this.props.dispatch(removeUserFromAllUsers(userID));
        this.props.dispatch(push(url.resolve("../../")));
    }

    render() {
        return (
            <Modal sizeClass="grid__col-xs-10 grid__col-md-6 grid__col-lg-4">
                <div className="modal__header">
                    <h2>Confirm delete</h2>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="modal__body">
                        <Input
                            id="confirm-delete"
                            label="Enter the email address of the user you want to delete"
                            onChange={this.handleChange}
                            error={this.state.error}
                            disabled={this.state.isSavingDelete}
                            isFocused={true}
                        />
                    </div>
                    <div className="modal__footer">
                        <button disabled={this.state.isSavingDelete} className="btn btn--warning" type="submit">Delete</button>
                        <button disabled={this.state.isSavingDelete} className="btn margin-left--1" type="button" onClick={this.handleClose}>Cancel</button>
                        {this.state.isSavingDelete && 
                            <div className="form__loader loader loader--dark margin-left--1"></div>
                        }
                    </div>
                </form>
            </Modal>
        )
    }
}

ConfirmUserDeleteController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        loggedInUser: state.state.user
    }
}

export default connect(mapStateToProps)(ConfirmUserDeleteController);