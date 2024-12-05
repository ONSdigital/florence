import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../config/groups/thunks";
import Groups from "./Groups";
import { getGroupsLoading, getMappedSortedGroups } from "../../config/selectors";

function mapStateToProps(state) {
    return {
        groups: getMappedSortedGroups(state.state),
        isLoading: getGroupsLoading(state.state),
        loggedInUser: state.user,
    };
}

const mapDispatchToProps = dispatch => ({
    loadTeams: () => dispatch(fetchGroupsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
