import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from '../../../utilities/url';

import Page from '../../../components/page/Page';

const propTypes = {
    collectionID: PropTypes.string.isRequired,
    activePageID: PropTypes.string,
    name: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onPageClick: PropTypes.func.isRequired,
    onEditPageClick: PropTypes.func.isRequired,
    isLoadingDetails: PropTypes.bool,
    inProgress: PropTypes.array,
    complete: PropTypes.array,
    reviewed: PropTypes.array
};

export class CollectionDetails extends Component {
    constructor(props) {
        super(props);
    }

    renderPageItem(page) {
        const pageID = url.slug(page.uri);
        const handlePageClick = () => {
            this.props.onPageClick(pageID);
        }
        const handleEditClick = () => {
            this.props.onEditPageClick(page.uri);
        }
        return (
            <li key={page.uri} onClick={handlePageClick} className={"list__item list__item--expandable" + (this.props.activePageID === pageID ? " active" : "")}>
                <Page type={page.type} title={page.description.title} />
                <div className="expandable-item-contents margin-top--1">
                    <button className="btn btn--primary" onClick={handleEditClick} type="button">Edit</button>
                    <button className="btn btn--warning btn--margin-left" type="button" disabled>Delete</button>
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
        if (this.props.inProgress.length === 0) {
            return <p className="margin-bottom--2">No pages in progress</p>
        }

        const pages = this.props.inProgress.map(page => {
            return this.renderPageItem(page);
        });
        return this.renderPagesList(pages);
    }
    
    renderWaitingReview() {
        if (this.props.complete.length === 0) {
            return <p className="margin-bottom--2">No pages awaiting review</p>
        }

        const pages = this.props.complete.map(page => {
            return this.renderPageItem(page);
        });
        return this.renderPagesList(pages);
    }
    
    renderReviewed() {
        if (this.props.reviewed.length === 0) {
            return <p className="margin-bottom--2">No reviewed pages</p>
        }

        const pages = this.props.reviewed.map(page => {
            return this.renderPageItem(page);
        });
        return this.renderPagesList(pages);
    }

    render () {
        return (
            <div className="drawer__container">
                <h2 className="drawer__heading">{this.props.name}</h2>
                <div className="drawer__banner">
                    <button className="btn btn--primary" disabled>Create/edit page</button>
                    <button className="btn btn--margin-left" disabled>Restore page</button>
                </div>
                <div className="drawer__body">
                    {this.props.isLoadingDetails ?
                        <div className="grid grid--align-center margin-top--4">
                            <div className="loader loader--large loader--dark"></div>
                        </div>
                        :
                        <div>
                            <h3 className="margin-bottom--1">{this.props.inProgress.length} page{this.props.inProgress.length > 1 && "s"} in progress</h3>
                            {this.renderInProgress()}
                            <h3 className="margin-bottom--1">{this.props.complete.length} page{this.props.complete.length > 1 && "s"} awaiting review</h3>
                            {this.renderWaitingReview()}
                            <h3 className="margin-bottom--1">{this.props.reviewed.length} reviewed page{this.props.reviewed.length > 1 && "s"}</h3>
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