import { connect } from "react-redux";
import { deleteGroupRequest } from "../../../config/groups/thunks";
import { addPopout, removePopouts } from "../../../config/actions";
import { getIsDeletingGroup } from "../../../config/selectors";
import Delete from "./Delete";

export const mapStateToProps = state => {
    return {
        loading: getIsDeletingGroup(state.state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        deleteGroup: id => dispatch(deleteGroupRequest(id)),
        openModal: popout => dispatch(addPopout(popout)),
        closeModal: id => dispatch(removePopouts(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Delete);
