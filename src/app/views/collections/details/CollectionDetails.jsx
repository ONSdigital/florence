import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import url from '../../../utilities/url';
import log, {eventTypes} from '../../../utilities/log';
import Page from '../../../components/page/Page';
import date from '../../../utilities/date';

export const pagePropTypes = {
    lastEdit: PropTypes.shape({
        email: PropTypes.string,
        date: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    edition: PropTypes.string,
    uri: PropTypes.string.isRequired,
    type: PropTypes.string
}

export const deletedPagePropTypes = PropTypes.shape({
    uri: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.shape({
        title: PropTypes.string.isRequired,
        edition: PropTypes.string,
        language: PropTypes.string
    }),
    children: PropTypes.arrayOf(PropTypes.object),
    deleteMarker: PropTypes.bool.isRequired,
    contentPath: PropTypes.string.isRequired
});

const propTypes = {
    id: PropTypes.string.isRequired,
    activePageURI: PropTypes.string,
    name: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onEditPageClick: PropTypes.func.isRequired,
    onDeletePageClick: PropTypes.func.isRequired,
    onCancelPageDeleteClick: PropTypes.func.isRequired,
    onDeleteCollectionClick: PropTypes.func.isRequired,
    onApproveCollectionClick: PropTypes.func.isRequired,
    isLoadingNameAndDate: PropTypes.bool,
    isLoadingDetails: PropTypes.bool,
    isCancellingDelete: PropTypes.shape({
        value: PropTypes.bool.isRequired,
        uri: PropTypes.string.isRequired
    }),
    isApprovingCollection: PropTypes.bool,
    canBeDeleted: PropTypes.bool,
    canBeApproved: PropTypes.bool,
    inProgress: PropTypes.arrayOf(PropTypes.shape(
        pagePropTypes
    )),
    complete: PropTypes.arrayOf(PropTypes.shape(
        pagePropTypes
    )),
    reviewed: PropTypes.arrayOf(PropTypes.shape(
        pagePropTypes
    )),
    deletes: PropTypes.arrayOf(PropTypes.shape({
        user: PropTypes.string.isRequired,
        root: deletedPagePropTypes,
        totalDeletes: PropTypes.number.isRequired
    })),
    status: PropTypes.shape({
        neutral: PropTypes.bool,
        warning: PropTypes.bool
    }),
    type: PropTypes.string,
    publishDate: PropTypes.string,
    dispatch: PropTypes.func.isRequired
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);

        this.handleRestoreContentClick = this.handleRestoreContentClick.bind(this);
        this.handleCollectionDeleteClick = this.handleCollectionDeleteClick.bind(this);
        this.handleCollectionApproveClick = this.handleCollectionApproveClick.bind(this);
    }

    handleCollectionDeleteClick() {
        this.props.onDeleteCollectionClick(this.props.id);
    }

    handleCollectionApproveClick() {
        this.props.onApproveCollectionClick(this.props.id);
    }

    renderLastEditText(lastEdit) {   
        try {
            if (!lastEdit || (!lastEdit.date && !lastEdit.email)) {
                return "Error getting 'last edit' details";
            }

            if (!lastEdit.date || typeof lastEdit.date !== "string") {
                return `Last edit: ${lastEdit.email} (date not available)`;
            }
            
            const formattedDate = date.format(new Date(lastEdit.date), "ddd d mmm yyyy - HH:MM:ss");
            if (!lastEdit.email || typeof lastEdit.email !== "string") {
                return `Last edit: email not available (${formattedDate})`;
            }
            return (
                `Last edit: ${lastEdit.email} (${formattedDate})`
            )
        } catch (error) {
            log.add(eventTypes.unexpectedRuntimeError, "Error parsing date for collection details 'page last edit' function. Last edit data: " + JSON.stringify(lastEdit));
            console.error("Error parsing date for collection details 'page last edit' function. Last edit data: ", lastEdit);

            if (lastEdit.email) {
                return `Last edit: ${lastEdit.email} (date not available)`;
            }

            return "Error rendering 'last edit' details";
        }
    }

    renderPageItem(page, state) {
        const handlePageClick = () => {
            this.props.onPageClick(page.uri);
        }
        const handleEditClick = () => {
            this.props.onEditPageClick(page.uri);
        }
        const handleDeleteClick = () => {
            this.props.onDeletePageClick(page.uri, page.title, state);
        }
        return (
            <li key={page.uri} onClick={handlePageClick} data-page-state={state} className={"list__item list__item--expandable" + (this.props.activePageURI === page.uri ? " active" : "")}>
                <div className="expandable-item__header">
                    <Page type={page.type} title={page.title + (page.edition ? ": " + page.edition : "")} isActive={this.props.activePageURI === page.uri} />
                </div>
                <div className="expandable-item__contents">
                    <div className="margin-bottom--1 margin-left--2">
                        <p>{this.renderLastEditText(page.lastEdit)}</p>
                    </div>
                    <button className="btn btn--primary" onClick={handleEditClick} type="button">{state === "complete" ? "Review" : "Edit"}</button>
                    <button className="btn btn--warning btn--margin-left" onClick={handleDeleteClick} type="button">Delete</button>
                </div>
            </li>
        )
    }

    renderPagesList(pages) {
        return (
            <ul className="list list--neutral margin-bottom--1">
                {pages}
            </ul>
        )
    }

    renderInProgress() {
        if (!this.props.inProgress) {
            return <p className="margin-bottom--2">Error getting in progress pages</p>
        }

        if (this.props.inProgress.length === 0) {
            return <p className="margin-bottom--2">No pages in progress</p>
        }

        const pages = this.props.inProgress.map(page => {
            return this.renderPageItem(page, "inProgress");
        });
        return this.renderPagesList(pages);
    }
    
    renderWaitingReview() {
        if (!this.props.complete) {
            return <p className="margin-bottom--2">Error getting pages awaiting review</p>
        }

        if (this.props.complete.length === 0) {
            return <p className="margin-bottom--2">No pages awaiting review</p>
        }

        const pages = this.props.complete.map(page => {
            return this.renderPageItem(page, "complete");
        });
        return this.renderPagesList(pages);
    }
    
    renderReviewed() {
        if (!this.props.reviewed) {
            return <p className="margin-bottom--2">Error getting reviewed pages</p>
        }

        if (this.props.reviewed.length === 0) {
            return <p className="margin-bottom--2">No reviewed pages</p>
        }

        const pages = this.props.reviewed.map(page => {
            return this.renderPageItem(page, "reviewed");
        });
        return this.renderPagesList(pages);
    }

    renderDeletetedPageChildItem(deletedChildPage) {
        let title = deletedChildPage.description.title + (deletedChildPage.description.edition ? ": " + deletedChildPage.description.edition : "");
        return (
            <li key={deletedChildPage.uri} className="margin-bottom--1">
                <Page type={deletedChildPage.type} title={<p>{title}<br/><a href={deletedChildPage.uri} target="_blank">{deletedChildPage.uri}</a></p>} />
            </li>
        )
    }

    renderDeletetedPageItem(deletedPage) {
        const handlePageClick = () => {
            this.props.onPageClick(deletedPage.root.uri);
        };
        const deleteIsBeingCancelled = this.props.isCancellingDelete ? (this.props.isCancellingDelete.value && this.props.isCancellingDelete.uri === deletedPage.root.uri) : false;
        return (
            <li key={deletedPage.root.uri} data-page-state="deletes" onClick={handlePageClick} className={"list__item list__item--expandable" + (this.props.activePageURI === deletedPage.root.uri ? " active" : "")}>
                <div className="expandable-item__header">
                    <Page 
                        type={deletedPage.root.type} 
                        title={deletedPage.root.description.title + (deletedPage.root.description.edition ? ": " + deletedPage.root.description.edition : "")} 
                        isActive={this.props.activePageURI === deletedPage.root.uri} 
                    />
                </div>
                <div className="expandable-item__contents">
                    <div className="margin-left--2 margin-bottom--1">
                        {deleteIsBeingCancelled &&
                            <p className="font-weight--600">Cancelling delete in progress</p>
                        }
                        <p>Deleted by: {deletedPage.user}</p>
                        <p>Path: <a href={deletedPage.root.uri} target="_blank">{deletedPage.root.uri}</a></p>
                        <p className="margin-bottom--1">Total deletes: {deletedPage.totalDeletes}</p>
                        <button disabled={deleteIsBeingCancelled} type="button" className="btn btn--warning" onClick={() => {this.props.onCancelPageDeleteClick(deletedPage.root.uri)}}>Cancel delete</button>
                        {(deletedPage.root.children && deletedPage.root.children.length > 0) &&
                            <div>
                                <h4 className="margin-top--1 margin-bottom--1">Sub-pages included in this delete:</h4>
                                <ul className="list--neutral">
                                    {deletedPage.root.children.map(childPage => {
                                        return this.renderDeletetedPageChildItem(childPage);
                                    })}
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </li>
        )
    }

    renderDeleted() {
        return (
            this.props.deletes.map(deletedPage => {
                return this.renderDeletetedPageItem(deletedPage)
            })
        )
    }

    statePageCount(state) {
        if (!this.props[state] || this.props[state].length === 0) {
            return "0";
        }
        return this.props[state].length.toString();
    }

    renderPluralisedPageText(state) {
        if (this.props[state] && this.props[state].length === 1) {
            return "page";
        }
        return "pages";
    }

    renderPageStateHeading(state) {
        switch (state) {
            case("inProgress"): {
                return (
                    this.statePageCount(state) + " " + this.renderPluralisedPageText(state) + " in progress"
                );
            }
            case("complete"): {
                return (
                    this.statePageCount(state) + " " + this.renderPluralisedPageText(state) + " awaiting review"
                );
            }
            case("reviewed"): {
                return (
                    this.statePageCount(state) + " reviewed " + this.renderPluralisedPageText(state)
                );
            }
            case("deletes"): {
                if (!this.props.deletes || this.props.deletes.length === 0) {
                    return;
                }
                return (
                    this.statePageCount(state) + " " + (this.props.deletes.length > 1 ? "deletes" : "delete")
                );
            }
        }
    }

    renderCollectionState() {
        if (!this.props.status) {
            return;
        }

        if (this.props.status.neutral) {
            return (
                <div className="drawer__banner drawer__banner--dark drawer__banner--large">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8">
                            Preparing collection for the publishing queue
                        </div>
                    </div>
                </div>
            )
        }
        
        if (this.props.status.warning) {
            return (
                <div className="drawer__banner drawer__banner--dark drawer__banner--large">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8">
                            Error whilst preparing this collection for the publishing queue
                        </div>
                    </div>
                </div>
            )
        }

        return;
    }

    renderCollectionPageActions() {
        if (this.props.status && (this.props.status.neutral || this.props.status.warning)) {
            return;
        }

        return (
            <div className="drawer__banner">
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-8 grid--align-start margin-top--1 margin-bottom--1">
                        <div>
                            <a href={url.resolve("/workspace") + "?collection=" + this.props.id} className={"btn btn--primary" + (this.props.isLoadingNameAndDate ? " btn--disabled" : "")}>Create/edit page</a>
                            <button disabled={this.props.isLoadingNameAndDate} className="btn btn--margin-left" onClick={this.handleRestoreContentClick}>Restore page</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleRestoreContentClick() {
        this.props.dispatch(push(`${location.pathname}/restore-content`));
    }

    renderCollectionActions() {
        if (this.props.isLoadingNameAndDate) {
            return;
        }

        if (this.props.status && (this.props.status.neutral || this.props.status.warning)) {
            return;
        }

        if (this.props.canBeDeleted) {
            return (
                <button className="btn btn--warning btn--margin-right" disabled={this.props.isLoadingDetails} onClick={this.handleCollectionDeleteClick} type="button" id="delete-collection">Delete</button>
            )
        }
        
        if (this.props.canBeApproved) {
            return (
                <button className="btn btn--positive btn--margin-right" disabled={this.props.isLoadingDetails || this.props.isApprovingCollection} onClick={this.handleCollectionApproveClick} type="button" id="approve-collection">Approve</button>
            )   
        }
    }

    renderPublishDate() {
        if (!this.props.type) {
            return;
        }

        if (this.props.type === "manual") {
            return <p>Manual publish</p>
        }

        if (this.props.type === "scheduled" && this.props.publishDate) {
            return (
                <p>Publish date: {date.format(this.props.publishDate, "dddd, d mmmm yyyy h:MMTT")}</p>
            )
        }

        if (this.props.type === "scheduled" && !this.props.publishDate) {
            return (
                <p>Publishing date: no publish date available</p>
            )
        }
    }

    render() {
        return (
            <div className="drawer__container">
                <div className="drawer__heading">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8">
                            <div className="grid grid--justify-space-between grid--align-end margin-top--3 margin-bottom--2">
                                <div>
                                    <h2>{this.props.isLoadingNameAndDate ? "Loading..." : this.props.name}</h2>
                                    {this.props.isLoadingNameAndDate ? 
                                        <p>Loading...</p>
                                    :
                                        this.renderPublishDate()
                                    }
                                </div>
                                {!this.props.isLoadingNameAndDate &&
                                    <Link to={`${location.pathname}/edit`} className="colour--cadet-blue font-size--16">Edit</Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderCollectionState()}
                {this.renderCollectionPageActions()}
                <div className="drawer__body">
                    <div className="grid grid--justify-space-around">
                        {this.props.isLoadingDetails ?
                            <div className="grid grid--align-center margin-top--4">
                                <div className="loader loader--large loader--dark"></div>
                            </div>
                            :
                            <div className="grid__col-8 margin-top--2">
                                <h3 className="margin-bottom--1">{this.renderPageStateHeading('inProgress')}</h3>
                                {this.renderInProgress()}
                                <h3 className="margin-bottom--1">{this.renderPageStateHeading('complete')}</h3>
                                {this.renderWaitingReview()}
                                <h3 className="margin-bottom--1">{this.renderPageStateHeading('reviewed')}</h3>
                                {this.renderReviewed()}
                                
                                {(this.props.deletes && this.props.deletes.length > 0) &&
                                    <div>
                                        <h3 className="margin-bottom--1">{this.renderPageStateHeading('deletes')}</h3>
                                        {this.renderDeleted()}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="drawer__footer">
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-8 margin-top--1 margin-bottom--1">
                            <div>
                                {this.renderCollectionActions()}
                                <button className="btn" onClick={this.props.onClose} type="button">Close</button>
                                {this.props.isApprovingCollection &&
                                    <div className="inline-block margin-left--1">
                                        <div className="loader loader--inline"></div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CollectionDetails.propTypes = propTypes;

export default connect()(CollectionDetails);