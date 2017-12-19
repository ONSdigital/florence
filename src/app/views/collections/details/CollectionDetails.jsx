import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

import url from '../../../utilities/url';
import log, {eventTypes} from '../../../utilities/log';
import Page from '../../../components/page/Page';

const propTypes = {
    collectionID: PropTypes.string.isRequired,
    activePageID: PropTypes.string,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onEditPageClick: PropTypes.func.isRequired,
    onDeletePageClick: PropTypes.func.isRequired,
    isLoadingDetails: PropTypes.bool,
    inProgress: PropTypes.array,
    complete: PropTypes.array,
    reviewed: PropTypes.array,
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);
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
        const pageID = url.slug(page.uri);
        const handlePageClick = () => {
            this.props.onPageClick(pageID);
        }
        const handleEditClick = () => {
            this.props.onEditPageClick(page.uri);
        }
        const handleDeleteClick = () => {
            this.props.onDeletePageClick(page.uri, page.description.title, state);
        }
        const pageEvents = page.events ? page.events[0] : {}; //FIXME we should probably be doing this in the controller, not in the view
        return (
            <li key={page.uri} onClick={handlePageClick} className={"list__item list__item--expandable" + (this.props.activePageID === pageID ? " active" : "")}>
                <Page type={page.type} title={page.description.title} isActive={this.props.activePageID === pageID} />
                <div className="expandable-item-contents">
                    <p className="colour--emperor margin-bottom--1 margin-left--2">{this.renderLastEditText(pageEvents)}</p>
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
        if (!this.props.inProgress || this.props.inProgress.length === 0) {
            return <p className="margin-bottom--2">No pages in progress</p>
        }

        const pages = this.props.inProgress.map(page => {
            return this.renderPageItem(page, "inProgress");
        });
        return this.renderPagesList(pages);
    }
    
    renderWaitingReview() {
        if (!this.props.complete || this.props.complete.length === 0) {
            return <p className="margin-bottom--2">No pages awaiting review</p>
        }

        const pages = this.props.complete.map(page => {
            return this.renderPageItem(page, "complete");
        });
        return this.renderPagesList(pages);
    }
    
    renderReviewed() {
        if (!this.props.reviewed || this.props.reviewed.length === 0) {
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

    render () {
        return (
            <div className="drawer__container">
                <h2 className="drawer__heading">{this.props.name}</h2>
                <div className="drawer__banner">
                    <a href={url.resolve("/workspace") + "?collection=" + this.props.collectionID} className="btn btn--primary" disabled>Create/edit page</a>
                    <button className="btn btn--margin-left" disabled>Restore page</button>
                </div>
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
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}

CollectionDetails.propTypes = propTypes;

export default CollectionDetails;