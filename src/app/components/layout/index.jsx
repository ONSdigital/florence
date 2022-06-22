import { connect } from "react-redux";
import Layout from "./Layout";
import { getNotifications } from "../../config/selectors";

function mapStateToProps(state) {
    return {
        notifications: getNotifications(state.state),
        popouts: state.state.popouts,
        user: state.user,
        config: state.state.config,
    };
}

export default connect(mapStateToProps)(Layout);
