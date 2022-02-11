import { connect } from "react-redux";
import { fetchUserRequest, fetchUserGroupsRequest, fetchGroupsRequest } from "../../../config/thunks";
import { getUser, getUserLoading, getGroupsLoading, getGroups } from "../../../config/selectors";
import UserDetails from "./UserDetails";

export const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    user: getUser(state.state),
    loading: getUserLoading(state.state),
    loadingGroups: getGroupsLoading(state.state),
    groups: getGroups(state.state),
});

export const mapDispatchToProps = dispatch => ({
    loadUser: id => dispatch(fetchUserRequest(id)),
    loadGroups: () => dispatch(fetchGroupsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
