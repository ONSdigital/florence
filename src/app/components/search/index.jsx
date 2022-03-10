import { connect } from "react-redux";
import { saveSearch } from "../../config/actions";
import Search from "./Search";

const mapDispatchToProps = dispatch => ({
    saveSearch: value => dispatch(saveSearch(value)),
});

export default connect(null, mapDispatchToProps)(Search);
