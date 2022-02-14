import { connect } from "react-redux";
import { createUserRequest } from "../../../config/thunks";
import CreateUser from "./CreateUser";

export const mapStateToProps = state => ({
    loading: state.state.users.isCreating,
    rootPath: state.state.rootPath,
});

const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(createUserRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
