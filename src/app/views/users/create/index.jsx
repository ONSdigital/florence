import { connect } from "react-redux";
import { createUserRequest } from "../../../config/thunks";
import NewUser from "./NewUser";

export const mapStateToProps = state => ({
    loading: state.user.isCreating,
    rootPath: state.state.rootPath,
});

const mapDispatchToProps = dispatch => ({
    createUser: user => dispatch(createUserRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
