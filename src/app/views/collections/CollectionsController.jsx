import React, { Component } from 'react';
import { connect } from 'react-redux'

import collections from '../../utilities/api-clients/collections';

import { CollectionCreate } from './create/CollectionCreate';

class Collections extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: []
        };

        this.handleCollectionSelection = this.handleCollectionSelection.bind(this);

    }

    componentWillMount() {
        this.fetchCollections();
    }

    fetchCollections() {
        collections.getAll().then(collections => {
            console.log(collections);
            this.setState({collections: collections})
        })
    }

    handleCollectionCreateSuccess() {
        // route to collection details pane for new collection
        // update list of collections
    }

    handleCollectionSelection() {
        // trigger collection details view
        console.log('clicked');
    }

    render () {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>
                        <ul>
                        {this.state.collections ?
                            this.state.collections.map((collection, index) => {
                                return <li key={index} onClick={this.handleCollectionSelection}>{collection.name}</li>
                            }) : ""
                        }
                        </ul>

                    </div>
                    <div className="grid__col-4">
                        <h1>Create a collection</h1>
                        <CollectionCreate user={this.props.user} onSuccess={this.handleCollectionCreateSuccess}/>

                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.state.user
    }
}

export default connect(mapStateToProps)(Collections);