import { connect } from "react-redux";
import { deleteTokensRequest } from "../../config/thunks";
import { addPopout, removePopouts } from "../../config/actions";
import { getIsRemovingAllTokens } from "../../config/selectors";
import Security from "./Security";

export const mapStateToProps = state => {
    return {
        loading: getIsRemovingAllTokens(state.state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOutAllUsers: () => dispatch(deleteTokensRequest()),
        openModal: popout => dispatch(addPopout(popout)),
        closeModal: id => dispatch(removePopouts(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Security);
