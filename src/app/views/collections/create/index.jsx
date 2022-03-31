import { connect } from "react-redux";
import CreateNewCollection from "./CreateNewCollection";
import { fetchGroupsRequest } from "../../../config/groups/thunks";
import { createCollectionRequest } from "../../../config/thunks";
import { getGroupsLoading, getEnableNewSignIn, getEnablePermissionsAPI, getMappedGroups, getGroups } from "../../../config/selectors";

export const mapStateToProps = state => ({
    teams: getGroups(state.state),
    fetchingTeams: getGroupsLoading(state.state),
    isNewSignIn: getEnableNewSignIn(state.state),
    isEnablePermissionsAPI: true //getEnablePermissionsAPI(state.state),
});

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
    createCollectionRequest: (collection, teams, isEnablePermissionsAPI) => dispatch(createCollectionRequest(collection, teams, isEnablePermissionsAPI)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollection);
