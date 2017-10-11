import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import url from '../../../utilities/url'

import Select from '../../../components/Select';
import Input from '../../../components/Input';

const propTypes = {
    hasChosen: PropTypes.bool.isRequired,
    isGettingCollections: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string,
    collectionsSelectItems: PropTypes.array,
    allCollections: PropTypes.array,
    selectedCollection: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleCollectionChange: PropTypes.func.isRequired,
    handleNextReleaseChange: PropTypes.func.isRequired,
    handleOnBackFromSuccess: PropTypes.func.isRequired,
    backLink: PropTypes.string.isRequired
};

class CollectionView extends Component {
    constructor(props) {
        super(props)
    }

    renderSuccess() {
        const selectedCollection = this.props.selectedCollection;
        const link = url.parent(url.parent());
        return (
            <div>
                <div className="margin-top--2">
                    &#9664; <Link onClick={this.props.handleOnBackFromSuccess}>Back</Link>
                </div>
                <h1 className="margin-top--1">Success</h1>
                <p>This dataset has been checked and added to {selectedCollection.name}.</p>
                <Link to={link} className="btn btn--positive margin-top--1">
                    Return to datasets
                </Link>
            </div>
        )
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
                        />

                        {selectedCollection.id ? this.renderSelectedCollectionDetails() : ""}

                        <Input id="next-release-date"
                               label="Next release date"
                               onChange={this.props.handleNextReleaseChange}
                        />

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