import { connect } from "react-redux";
import CreateNewCollection from "./CreateNewCollection";
import { loadTeamsRequest, createCollectionRequest } from "../../../config/thunks";
import { getMappedTeams, getTeamsLoading } from "../../../config/selectors";

export const mapStateToProps = state => ({
    teams: getMappedTeams(state.state),
    fetchingTeams: getTeamsLoading(state.state),
});

const mapDispatchToProps = dispatch => ({
    loadTeams: () => dispatch(loadTeamsRequest()),
    createCollectionRequest: collection => dispatch(createCollectionRequest(collection)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCollection);
