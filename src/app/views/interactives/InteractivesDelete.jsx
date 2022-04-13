import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { deleteInteractive, getInteractive, resetInteractiveError } from "../../actions/interactives";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import BackButton from "../../components/back-button";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";

export class InteractivesDelete extends Component {
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

    handleReturn() {
        const rootPath = this.props.rootPath;
        this.props.router.push(`${rootPath}/interactives/edit/${this.state.interactiveId}`);
    }

    render() {
        const { rootPath } = this.props;

        return (
            <FooterAndHeaderLayout title="Manage my interactives">
                <div className="grid grid--justify-space-around padding-bottom--2">
                    <div className={"grid__col-8"}>
                        <BackButton redirectUrl={`${rootPath}/interactives`} classNames={"ons-breadcrumb__item"} />
                        <h1 className="text-align-left">Delete interactive</h1>
                        <p className={"padding-bottom--1"}>You are about to delete this interactive:</p>
                        <ul className="list-simple">
                            <li className="list-simple__item">
                                Name - <b>{this.state.title}</b>
                            </li>
                            <li className="list-simple__item">
                                Published date - <b>11 March 2022</b>
                            </li>
                            <li className="list-simple__item">
                                Topic - <b>Health and social care (COVID-19)</b>
                            </li>
                        </ul>
                        <p className="">
                            Are you sure you want to delete this interactive? You will permanently lose access to the data associated to it, including
                            the uploaded file.
                        </p>
                        <div className={"inline-block padding-top--2"}>
                            <ButtonWithShadow type="button" buttonText="Continue" onClick={this.handleDelete} isSubmitting={false} />
                            <ButtonWithShadow type="button" class="secondary" buttonText="Cancel" onClick={this.handleReturn} isSubmitting={false} />
                        </div>
                    </div>
                </div>
            </FooterAndHeaderLayout>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesDelete);
