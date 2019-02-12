import React, { Component } from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import log from '../../../utilities/logging/log';

const propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func,
    name: PropTypes.string,
    email: PropTypes.string,
    isLoading: PropTypes.bool,
    hasTemporaryPassword: PropTypes.bool,
    role: PropTypes.oneOf(["ADMIN", "EDITOR", "VIEWER"]),
    errorFetchingUserDetails: PropTypes.bool,
    errorFetchingUserPermissions: PropTypes.bool,
    showChangePassword: PropTypes.bool,
    showFooter: PropTypes.bool,
};

export class UserDetails extends Component {
    constructor(props) {
        super(props);
    }

    renderRole() {
        if (this.props.role === "ADMIN") {
            return (
                <p id="user-role" className="margin-bottom--1">{this.props.name} is an <strong>admin</strong></p>
            )
        }
        
        if (this.props.role === "EDITOR") {
            return (
                <p id="user-role" className="margin-bottom--1">{this.props.name} is a <strong>publisher</strong></p>
            )
        }
        
        if (this.props.role === "VIEWER") {
            return (
                <p id="user-role" className="margin-bottom--1">{this.props.name} is a <strong>viewer</strong></p>
            )
        }

        if (!this.props.role) {
            log.event(`Attempted to render role for user but none passed in as prop`, log.warn(), log.data({user: this.props.email}));
            return (
                <p id="user-role" className="margin-bottom--1">{this.props.name} has no permissions</p>
            )
        }

        log.event("Attempted to render an unknown user role", log.warn(), log.data({user: this.props.email, role: this.props.role}));
        return (
            <p id="user-role" className="margin-bottom--1">{this.props.name} is a <strong>{this.props.role}</strong> (unrecognised user type)</p>
        )
    }

    render() {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--3 margin-bottom--2">
                            <h2 id="user-name">
                                {this.props.isLoading ?
                                    "Loading user..."
                                :
                                    this.props.name || "[No name available]"
                                }
                            </h2>
                            <p id="user-email">{this.props.email}</p>
                        </div>
                    </div>
                </div>
                {this.props.showChangePassword &&
                    <div className="drawer__banner">
                        <div className="grid grid--justify-space-around">
                            <div className="grid__col-8 grid--align-start margin-top--1 margin-bottom--1">
                                <Link className="btn btn--primary" to={`${location.pathname}/change-password`}>Change password</Link>
                            </div>
                        </div>
                    </div>
                }
                <div className="drawer__body">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--1">
                            {this.props.isLoading ? 
                                <div className="grid grid--align-center margin-top--4">
                                    <div className="loader loader--large loader--dark"></div>
                                </div>
                            :    
                                <div>
                                    {this.props.errorFetchingUserDetails &&
                                        <p className="margin-bottom--1">Unable to show user's details</p>
                                    }
                                    {this.props.errorFetchingUserPermissions &&
                                        <p className="margin-bottom--1">Unable to show user's permissions</p>
                                    }
                                    {this.props.role &&
                                        this.renderRole()
                                    }
                                    {this.props.hasTemporaryPassword &&
                                        <p id="user-temporary-password" className="margin-bottom--1">Has a temporary password</p>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.props.showFooter && 
                    <div className="drawer__footer">
                        <div className="grid grid--justify-space-around">
                            <div className="grid__col-8 margin-top--1 margin-bottom--1">
                                <div>
                                    <Link id="user-delete" className="btn btn--warning" to={`${location.pathname}/confirm-delete`}>Delete</Link>
                                    <button id="user-close" className="btn margin-left--1" onClick={this.props.onClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

UserDetails.propTypes = propTypes;

export default UserDetails;