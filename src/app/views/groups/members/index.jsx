// import { connect } from "react-redux";
// import { fetchGroupMembersRequest } from "../../../config/groups/thunks";
// import { getGroupMembers, getGroupMembersLoading } from "../../../config/selectors";
// import Members from "./Members";

// export const mapStateToProps = state => ({
//     loading: getGroupMembersLoading(state.state),
//     members: getGroupMembers(state.state),
//     // adding: getAddingMembersToGroup(state.state),
// });

// export const mapDispatchToProps = dispatch => ({
//     loadMembers: id => dispatch(fetchGroupMembersRequest(id)),
//     // addMembersToGroup: (id, members) => dispatch(addMembersToGroupRequest(id, members)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Members);
import Members from "./Members";
export default Members;
