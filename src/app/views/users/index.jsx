import { connect } from "react-redux";
import { getUsersRequest } from "../../config/thunks";
import { getMappedUsers, getUsersLoading } from "../../config/selectors";
import UsersList from "./UsersList";

export const mapStateToProps = state =>
    console.log("Show me my state", state) || {
        rootPath: state.state.rootPath,
        users: getMappedUsers(state.state),
        loggedInUser: state.user,
        isLoading: getUsersLoading(state.state),
    };

export const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(getUsersRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
