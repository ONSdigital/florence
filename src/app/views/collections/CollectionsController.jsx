import React, { Component } from 'react';
import { connect } from 'react-redux'

import CollectionCreate from './create/CollectionCreate';

class Collections extends Component {
    constructor(props) {
        super(props);
    }

    handleCollectionCreateSuccess() {
        // route to collection details pane for new collection
        // update list of collections
    }

    render () {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>

                    </div>
                    <div className="grid__col-4">
                        <h1>Create a collection</h1>
                        <CollectionCreate onSuccess={this.handleCollectionCreateSuccess}/>

                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Collections);