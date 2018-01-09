import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

import url from '../../../utilities/url';
import log, {eventTypes} from '../../../utilities/log';
import Page from '../../../components/page/Page';

export const pagePropTypes = {
    lastEdit: PropTypes.shape({
        email: PropTypes.string,
        date: PropTypes.string
    }),
    title: PropTypes.string.isRequired,
    edition: PropTypes.string,
    uri: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

const propTypes = {
    id: PropTypes.string.isRequired,
    activePageURI: PropTypes.string,
    name: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onEditPageClick: PropTypes.func.isRequired,
    onDeletePageClick: PropTypes.func.isRequired,
    onDeleteCollectionClick: PropTypes.func.isRequired,
    onApproveCollectionClick: PropTypes.func.isRequired,
    isLoadingDetails: PropTypes.bool,
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
    status: PropTypes.shape({
        neutral: PropTypes.bool,
        warning: PropTypes.bool
    }),
    type: PropTypes.string.isRequired,
    publishDate: PropTypes.string
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);

        this.handleCollectionDeleteClick = this.handleCollectionDeleteClick.bind(this);
        this.handleCollectionApproveClick = this.handleCollectionApproveClick.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.isLoadingDetails && nextProps.isLoadingDetails) {
            return false;
        }
        return true;
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
            
            const date = dateFormat(new Date(lastEdit.date), "ddd d mmm yyyy - HH:MM:ss");
            if (!lastEdit.email || typeof lastEdit.email !== "string") {
                return `Last edit: email not available (${date})`;
            }
            return (
                `Last edit: ${lastEdit.email} (${date})`
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
            <li key={page.uri} onClick={handlePageClick} className={"list__item list__item--expandable" + (this.props.activePageURI === page.uri ? " active" : "")}>
                <Page type={page.type} title={page.title + (page.edition ? ": " + page.edition : "")} isActive={this.props.activePageURI === page.uri} />
                <div className="expandable-item-contents">
                    <p className="colour--emperor margin-bottom--1 margin-left--2">{this.renderLastEditText(page.lastEdit)}</p>
                    <button className="btn btn--primary" onClick={handleEditClick} type="button">Edit</button>
                    <button className="btn btn--warning btn--margin-left" onClick={handleDeleteClick} type="button">Delete</button>
                </div>
            </li>
        )
    }

    renderPagesList(pages) {
        return (
            <ul className="list list--neutral margin-bottom--2">
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
        }
    }

    renderCollectionState() {
        if (!this.props.status) {
            return;
        }

        if (this.props.status.neutral) {
            return (
                <div className="drawer__banner drawer__banner--dark drawer__banner--large">
                    Preparing collection for the publishing queue
                </div>
            )
        }
        
        if (this.props.status.warning) {
            return (
                <div className="drawer__banner drawer__banner--dark drawer__banner--large">
                    Error whilst preparing this collection for the publishing queue
                </div>
            )
        }
    }

    renderCollectionPageActions() {
        if (this.props.status && (this.props.status.neutral || this.props.status.warning)) {
            return;
        }

        return (
            <div className="drawer__banner">
                <a href={url.resolve("/workspace") + "?collection=" + this.props.id} className="btn btn--primary" disabled>Create/edit page</a>
                <button className="btn btn--margin-left" disabled>Restore page</button>
            </div>
        )
    }

    renderCollectionActions() {
        if (this.props.status && (this.props.status.neutral || this.props.status.warning)) {
            return;
        }

        if (this.props.canBeDeleted) {
            return (
                <button className="btn btn--warning btn--margin-left" disabled={this.props.isLoadingDetails} onClick={this.handleCollectionDeleteClick} type="button" id="delete-collection">Delete</button>
            )
        }
        
        if (this.props.canBeApproved) {
            return (
                <button className="btn btn--positive btn--margin-left" disabled={this.props.isLoadingDetails} onClick={this.handleCollectionApproveClick} type="button" id="approve-collection">Approve</button>
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
                <p>Publish date: {this.props.publishDate}</p>
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
                    <h2>{this.props.name}</h2>
                    {this.renderPublishDate()}
                </div>
                {this.renderCollectionState()}
                {this.renderCollectionPageActions()}
                <div className="drawer__body">
                    {this.props.isLoadingDetails ?
                        <div className="grid grid--align-center margin-top--4">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                        :
                        <div>
                            <h3 className="margin-bottom--1">{this.renderPageStateHeading('inProgress')}</h3>
                            {this.renderInProgress()}
                            <h3 className="margin-bottom--1">{this.renderPageStateHeading('complete')}</h3>
                            {this.renderWaitingReview()}
                            <h3 className="margin-bottom--1">{this.renderPageStateHeading('reviewed')}</h3>
                            {this.renderReviewed()}
                        </div>
                    }
                </div>
                <div className="drawer__footer">
                    <button className="btn" onClick={this.props.onClose} type="button">Close</button>
                    {this.renderCollectionActions()}
                </div>
            </div>
        )
    }
}

CollectionDetails.propTypes = propTypes;

export default CollectionDetails;