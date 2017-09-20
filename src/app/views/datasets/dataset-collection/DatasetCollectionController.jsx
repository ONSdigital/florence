import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import collections from '../../../utilities/api-clients/collections'

class DatasetCollectionController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isGettingCollections: false,
            collections: [],
            allCollections: [],
            selectedCollection: {},
            nextRelease: "",
            isSubmitting: false
        };

        this.handleCollectionChange = this.handleCollectionChange.bind(this);
        this.handleNextReleaseChange = this.handleNextReleaseChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.getCollections();
    }

    getCollections() {
        this.setState({isGettingCollections: true});
        collections.getAll()
            .then(allCollections => {
                const collections = [];
                allCollections.map(item => {
                    collections.push({id: item.id, name: item.name})
                });
                this.setState({
                    collections: collections,
                    allCollections: allCollections,
                    isGettingCollections: false
                })
            })
    }

    handleCollectionChange(event) {
        const collectionID = event.target.value;
        const selectedCollection = this.state.allCollections.find(collection => {
            return collection.id === collectionID;
        });

        this.setState({
            selectedCollection: {
                id: collectionID,
                releaseDate: selectedCollection.publishDate ? dateFormat(selectedCollection.publishDate, "dddd, mmmm dS, yyyy") : "",
                releaseTime: selectedCollection.publishDate ? dateFormat(selectedCollection.publishDate, "hh:MM:ss") : "",
                type: selectedCollection.type
            }
        })
    }

    handleNextReleaseChange(event) {
        const value = event.target.value;
        this.setState({nextRelease: value})
    }

    handleSubmit(event) {
        event.preventDefault();

        // const credentials = {
        //     email: this.state.email.value,
        //     password: this.state.password.value
        // };

        alert('You submitted!');

        this.setState({ isSubmitting: true });

        //this.handleLogin(credentials);

    }

    renderSelectedCollectionDetails() {
        const selectedCollection = this.state.selectedCollection;

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
        const selectedCollection = this.state.selectedCollection;
        const isSubmitting = this.state.isSubmitting;

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    <Link to="/">Back</Link>
                    <h1>Add to collection</h1>
                    {this.state.collections.length > 0 ?
                        <form onSubmit={this.handleSubmit}>
                            <Select id="collection"
                                    contents={this.state.collections}
                                    label="Choose a collection"
                                    override={false}
                                    onChange={this.handleCollectionChange}
                            />

                            {selectedCollection.id ? this.renderSelectedCollectionDetails() : ""}

                            <Input id="next-release-date"
                                   label="Next release date"
                                   onChange={this.handleNextReleaseChange}
                            />

                            <button type="submit" className="btn btn--positive" disabled={isSubmitting}>
                                Save and continue
                            </button>

                            {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1"></div> : ""}

                        </form>
                    : <div className="form__loader loader loader--dark margin-left--1"></div> }
                </div>
            </div>

        )
    }

}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(DatasetCollectionController);
