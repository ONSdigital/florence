import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { updateActiveTeamMembers } from '../../config/actions';
// import teams from '../../utilities/teams';

const propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
    userIsAdmin: PropTypes.bool.isRequired,
    onEditMembers: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isShowingLoader: PropTypes.bool
}

class TeamDetails extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     // isFetchingMembers: false,
        //     showingLoader: false
        // };
    }

    componentWillMount() {
        // TODO remove this from TeamDetails and put in Teams controller instead - it currently breaks if you go directly to 'edit' screen on load because the responsibility for getting active team members is too specific to this component
        // this.fetchMembers(this.props.name);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            // this.fetchMembers(nextProps.name);
        }
    }

    // fetchMembers(teamName) {
    //     const loaderTimer = window.setTimeout(() => {
    //         this.setState({showingLoader: true});
    //     }, 80); // Show a loader if request is taking longer than 80ms

    //     this.setState({isFetchingMembers: true});
    //     teams.get(teamName).then(team => {
    //         window.clearTimeout(loaderTimer);
    //         this.props.dispatch(updateActiveTeamMembers(team.members));
    //         this.setState({
    //             isFetchingMembers: false,
    //             showingLoader: false
    //         });
    //     });
    // }

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
                    {
                        this.props.userIsAdmin && 
                            <div className="drawer__banner">
                                    <button onClick={this.props.onEditMembers} className="btn btn--primary">Add / remove members</button>
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
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}

TeamDetails.propTypes = propTypes;

export default connect()(TeamDetails);