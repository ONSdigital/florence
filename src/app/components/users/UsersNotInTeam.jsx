import React, {useState} from "react";
import {connect} from "react-redux";
import DynamicList from "../../components/dynamic-list/DynamicList";
import {addUserToNewTeam} from "../../config/newTeam/newTeamActions";
import PropTypes from "prop-types";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    newTeam: PropTypes.shape({
        usersInTeam: PropTypes.arrayOf(PropTypes.object),
        usersNotInTeam: PropTypes.arrayOf(PropTypes.object),
        allUsers: PropTypes.arrayOf(PropTypes.object),
        unsavedChanges: PropTypes.bool
    }),
};
const UsersNotInTeam = props => {
    const [filterTerm, setFilterTerm] = useState("");
    const handleSearch = event => {
        const searchTerm = event.target.value.toLowerCase();
        setFilterTerm(searchTerm);
    };
    const compare = (a, b) => {
        return a.title.localeCompare(b.title);
    };

    let usersNotInTeamList = [];
    if (props.newTeam.usersNotInTeam != null) {
        usersNotInTeamList = props.newTeam.usersNotInTeam
            .map(user => {
                return {
                    title: `${user.forename} ${user.lastname}`,
                    desc: user.email,
                    icon: "Person",
                    buttonName: "Add",
                    buttonCallback: () => {
                        let newUser = props.newTeam.allUsers.find(viewer => viewer.email === user.email);
                        props.dispatch(addUserToNewTeam(newUser));
                    },
                    iconColor: "standard",
                };
            })
            .filter(viewer => viewer.title.toLowerCase().search(filterTerm) !== -1 || viewer.desc.toLowerCase().search(filterTerm) !== -1)
            .sort(compare);
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
                listHeightClass="height--60"
                loading={props.loading}
            />
        </div>
    );
};

UsersNotInTeam.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        newTeam: state.newTeam,
    };
}

export default connect(mapStateToProps)(UsersNotInTeam);
