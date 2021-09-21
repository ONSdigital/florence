import { connect } from "react-redux";
import Login from "./Login";

const mapStateToProps = state => {
    return {
        isAuthenticated: state.state.user.isAuthenticated,
        rootPath: state.state.rootPath
    };
};

export default connect(mapStateToProps)(Login);
