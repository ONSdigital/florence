import { connect } from "react-redux";
import CreateNewCollection from "./CreateNewCollection";
import { fetchGroupsRequest } from "../../../config/groups/thunks";
import { createCollectionRequest } from "../../../config/thunks";
import { getGroupsLoading, getEnableNewSignIn, getMappedGroups } from "../../../config/selectors";

export const mapStateToProps = state => ({
    teams: getMappedGroups(state.state),
    fetchingTeams: getGroupsLoading(state.state),
    isNewSignIn: getEnableNewSignIn(state.state),
});

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
    createCollectionRequest: collection => dispatch(createCollectionRequest(collection)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollection);
