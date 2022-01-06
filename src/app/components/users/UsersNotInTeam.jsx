import React, { useState } from "react";
import { connect } from "react-redux";
import DynamicList from "../../components/dynamic-list/DynamicList";
import PropTypes from "prop-types";
import { selectNewTeamAllPreviewUsers } from "../../config/selectors";

const propTypes = {
    loading: PropTypes.bool,
    addUserToTeam: PropTypes.func,
    usersNotInTeam: PropTypes.arrayOf(PropTypes.object),
    allPreviewUsers: PropTypes.arrayOf(PropTypes.object),
};
const UsersNotInTeam = props => {
    const { allPreviewUsers, usersNotInTeam, addUserToTeam } = props;
    const [filterTerm, setFilterTerm] = useState("");
    const handleSearch = event => {
        const searchTerm = event.target?.value?.toLowerCase();
        setFilterTerm(searchTerm);
    };
    const compare = (a, b) => {
        return a.title?.localeCompare(b.title);
    };

    let usersNotInTeamList = [];
    if (usersNotInTeam) {
        usersNotInTeamList = usersNotInTeam
            .map(user => {
                return {
                    title: `${user.forename} ${user.lastname}`,
                    desc: user.email,
                    icon: "Person",
                    buttonName: "Add",
                    buttonCallback: () => {
                        const newUser = allPreviewUsers.find(viewer => viewer.email === user.email);
                        addUserToTeam(newUser);
                    },
                    iconColor: "standard",
                };
            })
            .filter(viewer => viewer.title?.toLowerCase().search(filterTerm) !== -1 || viewer.desc?.toLowerCase().search(filterTerm) !== -1)
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
        allPreviewUsers: selectNewTeamAllPreviewUsers(state),
    };
}

export default connect(mapStateToProps)(UsersNotInTeam);
