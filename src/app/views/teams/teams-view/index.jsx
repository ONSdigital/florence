import {connect} from "react-redux";
import {loadTeamsRequest} from "../../../config/thunks";
import TeamsList from "./TeamsList";

function mapStateToProps(state) {
    return {
        teams: state.state.teams.all,
    };
}

const mapDispatchToProps = dispatch => ({
    loadTeams: () => dispatch(loadTeamsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamsList);
