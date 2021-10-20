import { connect } from "react-redux";
import Layout from "./Layout";

function mapStateToProps(state) {
    return {
        notifications: state.state.notifications,
    };
}

export default connect(mapStateToProps)(Layout);
