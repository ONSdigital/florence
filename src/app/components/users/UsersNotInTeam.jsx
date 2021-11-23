import React, {useState} from "react";
import {connect} from "react-redux";
import DynamicList from "../../components/dynamic-list/DynamicList";
import {addUserToTeam} from "../../config/actions";
import PropTypes from "prop-types";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    usersNotInTeam: PropTypes.arrayOf(PropTypes.object),
}
const UsersNotInTeam = props => {
    const [filterTerm, setFilterTerm] = useState("");
    const handleSearch = event => {
        const searchTerm = event.target.value.toLowerCase();
        setFilterTerm(searchTerm);
    };

    let usersNotInTeamList = []
    if (props != null && props.usersNotInTeam != null) {
        usersNotInTeamList = props.usersNotInTeam.map(user => {
            return {
                title: `${user.forename} ${user.surname}`,
                desc: user.email,
                icon: "Person",
                buttonName: "Add",
                buttonCallback: () => {
                    let newUser = props.users.find(viewer => viewer.email === user.email);
                    props.dispatch(addUserToTeam(newUser));
                },
                iconColor: "standard",
            }
        }).filter(viewer => viewer.title.toLowerCase().search(filterTerm) !== -1 || viewer.desc.toLowerCase().search(filterTerm) !== -1)
    }
    return (
        <div className="grid__col-4 margin-top--3">
            <DynamicList
                title="Add member to team"
                headingLevel="2"
                listItems={usersNotInTeamList}
                noResultsText="No viewers found"
                filterPlaceholder="Search viewers by name or email"
                handleSearchInput={handleSearch}
            />
        </div>
    );
};

UsersNotInTeam.propTypes = propTypes;

function mapStateToProps(state) {
    // TODO can I just return users
    return {
        users: state.state.users.all,
        usersNotInTeam: state.state.users.notInTeam,
    };
}

export default connect(mapStateToProps)(UsersNotInTeam);
