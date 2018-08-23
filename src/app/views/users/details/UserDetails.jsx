import React, { Component } from 'react';
import {Link} from 'react-router';
import Drawer from '../../../components/drawer/Drawer';
import PropTypes from 'prop-types';
import log, { eventTypes } from '../../../utilities/log';
import url from '../../../utilities/url';

const propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func,
    name: PropTypes.string,
    email: PropTypes.string,
    isLoading: PropTypes.bool,
    isDeleting: PropTypes.bool,
    hasTemporaryPassword: PropTypes.bool,
    role: PropTypes.oneOf(["ADMIN", "EDITOR", "VIEWER"]),
    errorFetchingUserDetails: PropTypes.bool,
    errorFetchingUserPermissions: PropTypes.bool,
    showChangePassword: PropTypes.bool
};

export class UserDetails extends Component {
    constructor(props) {
        super(props);
    }

    renderRole() {
        if (this.props.role === "ADMIN") {
            return (
                <p>{this.props.name} is an <strong>admin</strong></p>
            )
        }
        
        if (this.props.role === "EDITOR") {
            return (
                <p>{this.props.name} is an <strong>publisher</strong></p>
            )
        }
        
        if (this.props.role === "VIEWER") {
            return (
                <p>{this.props.name} is a <strong>viewer</strong></p>
            )
        }

        if (!this.props.role) {
            log.add(eventTypes.runtimeWarning, {message: `Attempt to render role for user '${this.props.email}' but none passed in as prop`});
            return (
                <p>{this.props.name} has no permissions</p>
            )
        }

        log.add(eventTypes.runtimeWarning, {message: `Attempt to render an unknown user role for '${this.props.email}': '${this.props.role}'`});
        return (
            <p>{this.props.name} is a <strong>{this.props.role}</strong> (unrecognised user type)</p>
        )
    }

    render() {
        return (
            <div>
                <Drawer isVisible={this.props.isVisible} isAnimatable={true}>
                    <div className="drawer__container">
                        <div className="drawer__heading">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-8 margin-top--3 margin-bottom--2">
                                    <h2>
                                        {this.props.isLoading ?
                                            "Loading user..."
                                        :
                                            this.props.name || "[No name available]"
                                        }
                                    </h2>
                                    <p>{this.props.email}</p>
                                    <p>
                                        {this.props.isLoading ?
                                            "Loading user type..."
                                        :
                                            this.props.role || "[No user type available]"
                                        }
                                    </p>
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
                                                <p>Unable to show user's details</p>
                                            }
                                            {this.props.errorFetchingUserPermissions &&
                                                <p>Unable to show user's permissions</p>
                                            }
                                            {this.props.role &&
                                                this.renderRole()
                                            }
                                            {this.props.hasTemporaryPassword &&
                                                <p>Has a temporary password</p>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="drawer__footer">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-8 margin-top--1 margin-bottom--1">
                                    <div>
                                        <button disabled={this.props.isLoading || this.props.isDeleting} className="btn btn--warning" onClick={this.props.onDelete}>Delete</button>
                                        {this.props.isCloseable && 
                                            <button className="btn margin-left--1" onClick={this.props.onClose}>Close</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

UserDetails.propTypes = propTypes;

export default UserDetails;