import React, {Component} from "react";
import {NavbarComponent} from "./components/NavbarComponent";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
    deleteInteractive,
    getInteractive,
    resetInteractiveError
} from "../../actions/interactives";
import {Link} from "react-router";

export class InteractivesDeleteController extends Component {

    static propTypes = {
        params: PropTypes.shape({
            interactiveId: PropTypes.string,
        }),
        resetInteractiveError: PropTypes.func.isRequired,
        deleteInteractive: PropTypes.func.isRequired,
        getInteractive: PropTypes.func.isRequired,
        rootPath: PropTypes.string.isRequired,
        errors: PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            internal_id: "",
            title: "",
            label: "",
            file: null,
            slug: "",
            interactiveId: null,
            published: false,
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
    }

    componentDidMount() {
        const { interactiveId } = this.props.params;
        this.setState({ interactiveId: interactiveId });
        this.props.getInteractive(interactiveId);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.successMessage.success) {
            const rootPath = this.props.rootPath;
            if (nextProps.successMessage.type === "delete") {
                this.props.router.push(`${rootPath}/interactives`);
            }
        }

        if (nextProps.interactive.metadata) {
            const { metadata } = nextProps.interactive;
            this.state.title = metadata.title;
            this.state.label = metadata.label;
            this.state.slug = metadata.slug;
            this.state.published = metadata.published;
        }
    }

    handleDelete(e) {
        e.preventDefault();
        this.props.deleteInteractive(this.state.interactiveId);
    }

    handleReturn(){
        const rootPath = this.props.rootPath;
        this.props.router.push(`${rootPath}/interactives/edit/${this.state.interactiveId}`);
    }

    render(){
        const { rootPath } = this.props;

        return (
            <div id="interactivesPage" className="ons-page">
                <div className="ons-page__content">
                    <main className="ons-patternlib-page__body">
                        <NavbarComponent/>
                        <div className="ons-container ons-container--wide">
                            <nav className="ons-breadcrumb" aria-label="Back">
                                <ol className="ons-breadcrumb__items ons-u-fs-s">
                                    <li className="ons-breadcrumb__item" id="breadcrumb-1">
                                        <Link to={`${rootPath}/interactives`} className="ons-breadcrumb__link">Back</Link>
                                        <svg className="ons-svg-icon" viewBox="0 0 8 13"
                                             xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor">
                                            <path
                                                d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                                                transform="translate(-5.02 -1.59)"/>
                                        </svg>
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="ons-u-fs-xxl ons-u-mt-l">Delete interactive</h1>
                            <p>You are about to delete this interactive:</p>
                            <ul className="ons-list">
                                <li
                                    className="ons-list__item"
                                    data-testid="interactive-title"
                                >
                                    Name - <b>{this.state.title}</b>
                                </li>
                                <li
                                    className="ons-list__item"
                                    data-testid="interactive-date"
                                >
                                    Published date - <b>11 March 2022</b>
                                </li>
                                <li
                                    className="ons-list__item"
                                    data-testid="interactive-topic"
                                >
                                    Topic - <b>Health and social care (COVID-19)</b>
                                </li>
                            </ul>
                            <p>Are you sure you want to delete this interactive? You will permanently lose access to the
                                data associated to it, including the uploaded file.</p>
                            <a
                                href="#"
                                role="button"
                                className="ons-btn ons-btn--link ons-js-submit-btn"
                                onClick={this.handleDelete}
                            >
                                <span className="ons-btn__inner">Continue</span>
                            </a>
                            <button
                                type="button"
                                className="ons-btn ons-btn--secondary"
                                onClick={this.handleReturn}
                            >
                                <span className="ons-btn__inner">Cancel</span>
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    errors: state.interactives.errors,
    successMessage: state.interactives.successMessage,
    interactive: state.interactives.interactive,
});

const mapDispatchToProps = dispatch => {
    return {
        getInteractive: interactiveId => {
            dispatch(getInteractive(interactiveId));
        },
        deleteInteractive: interactiveId => {
            dispatch(deleteInteractive(interactiveId));
        },
        resetInteractiveError: () => {
            dispatch(resetInteractiveError());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesDeleteController);