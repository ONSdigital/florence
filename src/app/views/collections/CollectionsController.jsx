import React, { Component } from 'react';
import { connect } from 'react-redux'

import CollectionCreate from './create/CollectionCreate';

class Collections extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>

                    </div>
                    <div className="grid__col-4">
                        <h1>Create a team</h1>


                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Collections);