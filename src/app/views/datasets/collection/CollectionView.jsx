import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import url from '../../../utilities/url'

import Select from '../../../components/Select';

const propTypes = {
    hasChosen: PropTypes.bool.isRequired,
    isGettingCollections: PropTypes.bool.isRequired,
    isGettingDataset: PropTypes.bool,
    isSubmitting: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string,
    collectionsSelectItems: PropTypes.array,
    allCollections: PropTypes.array,
    selectedCollection: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleCollectionChange: PropTypes.func.isRequired,
    handleOnBackFromSuccess: PropTypes.func.isRequired,
    backLink: PropTypes.string.isRequired,
    hasVersion: PropTypes.string
};

class CollectionView extends Component {
    constructor(props) {
        super(props)
    }

    renderSuccess() {
        const selectedCollection = this.props.selectedCollection;
        const isGettingDataset = this.props.isGettingDataset;
        return (
            <div>
                <div className="margin-top--2">
                    &#9664; <Link onClick={this.props.handleOnBackFromSuccess}>Back</Link>
                </div>
                <h1 className="margin-top--1">Success</h1>
                <p>This dataset has been checked and added to {selectedCollection.name}.</p>
                {isGettingDataset ?
                    <div className="form__loader loader loader--dark margin-left--1"></div> 
                    : 
                    this.renderNextStep()
                }
            </div>
        )
    }

    renderNextStep() {
        const hasVersion = this.props.hasVersion;

        if (hasVersion === "true"){
            const previewLink = `${location.pathname}/preview`;
            return (
                <Link to={previewLink} className="btn btn--positive margin-top--1 preview-link">
                    Preview dataset
                </Link>
            )
        }

        if (hasVersion === "false"){
            return (
                <Link className="btn btn--primary margin-top--1 upload-link" to={url.resolve("/uploads/data")}>
                    Upload a dataset
                </Link>
            )
        }

        if (hasVersion === ""){
            return (
                <Link className="btn btn--primary margin-top--1" to={url.resolve("/datasets")}>
                    Return to datasets
                </Link>
            )
        }
    }

    renderChoices() {
        const selectedCollection = this.props.selectedCollection;
        const isSubmitting = this.props.isSubmitting;
        return (
            <div>
                <div className="margin-top--2">
                    &#9664; <Link to={this.props.backLink}>Back</Link>
                </div>
                <h1 className="margin-top--1">Add to collection</h1>
                {this.props.collectionsSelectItems.length > 0 ?
                    <form onSubmit={this.props.handleSubmit}>
                        <Select id="collection"
                                contents={this.props.collectionsSelectItems}
                                label="Choose a collection"
                                override={false}
                                onChange={this.props.handleCollectionChange}
                                error={this.props.errorMsg}
                                selectedOption={this.props.selectedCollection.id}
                                version={this.props.hasVersion}
                        />

                        {selectedCollection.id ? this.renderSelectedCollectionDetails() : ""}

                        <button type="submit" className="btn btn--positive" disabled={isSubmitting}>
                            Save and continue
                        </button>

                        {isSubmitting ?
                            <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                    </form>
                    : <div className="form__loader loader loader--dark margin-left--1"></div>
                }
            </div>
        )

    }

    renderSelectedCollectionDetails() {
        const selectedCollection = this.props.selectedCollection;

        if (selectedCollection.type === "manual") {
            return (
                <div className="select-details">
                    <span className="select-details__label">Release date</span>: [manual collection]
                </div>
            )
        }

        if (selectedCollection.type === "scheduled") {
            return (
                <div className="select-details">
                    <span className="select-details__label">Release date</span>: {selectedCollection.releaseDate}<br/>
                    <span className="select-details__label">Release time</span>: {selectedCollection.releaseTime}
                </div>
            )
        }
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    {this.props.hasChosen ?
                        this.renderSuccess() :
                        this.renderChoices()
                    }
                </div>
            </div>
        )
    }
}
CollectionView.propTypes = propTypes;

export default CollectionView;