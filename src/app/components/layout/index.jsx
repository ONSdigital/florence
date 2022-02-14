import { connect } from "react-redux";
import Layout from "./Layout";
import { getNotifications } from "../../config/selectors";

function mapStateToProps(state) {
    return {
        notifications: getNotifications(state.state),
        popouts: state.state.popouts,
    };
}

export default connect(mapStateToProps)(Layout);
