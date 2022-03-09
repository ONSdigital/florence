import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    userIsAdmin: PropTypes.bool.isRequired,
    onEditMembers: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isShowingLoader: PropTypes.bool,
    isReadOnly: PropTypes.bool,
};

class InteractiveDetails extends Component {
    constructor(props) {
        super(props);
    }

    renderMembers() {
        const members = this.props.members;
        const list = (
            <div>
                <h3 className="margin-bottom--1">Members:</h3>
                <ul className="list list--neutral">
                    {members.map((member, index) => {
                        return (
                            <li className="list__item" key={index}>
                                {member}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
        return members.length > 0 ? list : <p>This team has no members</p>;
    }

    render() {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--3 margin-bottom--2">
                            <h2 id="team-name">{this.props.name}</h2>
                        </div>
                    </div>
                </div>
                {this.props.isReadOnly && (
                    <div className="drawer__banner drawer__banner--dark">
                        <div className="grid grid--justify-space-around">
                            <div className="grid__col-8 margin-top--1 margin-bottom--1">
                                <div>
                                    <h3>Read only</h3>
                                    <p>The list of teams if still being fetched so you can't edit or delete a team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.props.userIsAdmin && (
                    <div className="drawer__banner">
                        <div className="grid grid--justify-space-around">
                            <div className="grid__col-8 margin-top--1 margin-bottom--1">
                                <div>
                                    <button onClick={this.props.onEditMembers} disabled={this.props.isReadOnly} className="btn btn--primary">
                                        Add / remove members
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="drawer__body">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--1">
                            {this.props.isShowingLoader && (
                                <div className="grid grid--align-center margin-top--4">
                                    <div className="loader loader--large loader--dark"></div>
                                </div>
                            )}
                            {this.props.members && this.renderMembers()}
                        </div>
                    </div>
                </div>
                <div className="drawer__footer">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--1 margin-bottom--1">
                            <div>
                                {this.props.userIsAdmin && (
                                    <button
                                        className="btn btn--warning btn--margin-right"
                                        disabled={this.props.isReadOnly}
                                        onClick={this.props.onDelete}
                                    >
                                        Delete team
                                    </button>
                                )}
                                <button className="btn" onClick={this.props.onCancel}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

InteractiveDetails.propTypes = propTypes;

export default InteractiveDetails;
