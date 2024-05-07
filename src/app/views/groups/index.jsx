import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../config/groups/thunks";
import Groups from "./Groups";
import { getEnableNewSignIn, getGroupsLoading, getMappedSortedGroups } from "../../config/selectors";

function mapStateToProps(state) {
    return {
        groups: getMappedSortedGroups(state.state),
        isNewSignIn: getEnableNewSignIn(state.state),
        isLoading: getGroupsLoading(state.state),
        loggedInUser: state.user,
    };
}

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
