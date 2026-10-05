import { connect } from "react-redux";
import { fetchGroupsRequest } from "../../../config/groups/thunks";
import { createCollectionRequest } from "../../../config/thunks";
import { getGroupsLoading, getGroups } from "../../../config/selectors";
import CreateNewCollection from "./CreateNewCollection";

export const mapStateToProps = state => ({
    teams: getGroups(state.state),
    fetchingTeams: getGroupsLoading(state.state),
});

const mapDispatchToProps = dispatch => ({
    loadTeams: () => dispatch(fetchGroupsRequest()),
    createCollectionRequest: (collection, teams) => dispatch(createCollectionRequest(collection, teams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollection);
