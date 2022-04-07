import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../../config/groups/thunks";
import { updateCollectionRequest } from "../../../config/thunks";
import { getGroupsLoading, getEnableNewSignIn, getEnablePermissionsAPI, getGroups, getActive } from "../../../config/selectors";
import {
  updateActiveCollection,
  loadCollectionsSuccess,
  updatePagesInActiveCollection,
  updateTeamsInActiveCollection,
} from "../../../config/actions";
import EditCollection from "./EditCollection";

export const mapStateToProps = state => ({
    teams: getGroups(state.state),
    fetchingTeams: getGroupsLoading(state.state),
    isNewSignIn: getEnableNewSignIn(state.state),
    isEnablePermissionsAPI: getEnablePermissionsAPI(state.state),
    activeCollection: getActive(state.state),
});

const mapDispatchToProps = dispatch => ({
    loadTeams: isNewSignIn => dispatch(fetchGroupsRequest(isNewSignIn)),
    updateCollectionRequest: (collection, teams, isEnablePermissionsAPI) =>
        dispatch(updateCollectionRequest(collection, teams, isEnablePermissionsAPI)),
    updateActiveCollection: (data) => dispatch(updateActiveCollection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollection);
