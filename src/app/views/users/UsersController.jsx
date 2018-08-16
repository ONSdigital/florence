import React, { Component } from 'react';
import PropTypes from 'prop-types';

// UsersController.propTypes = {

// };


class UsersController extends Component {
    render() {
        return (
            <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a user</h1>
                    </div>

                    <div className="grid__col-4">
                        <h1>Create a user</h1>
                    </div>
                
            </div>
        );
    }
}


export default UsersController;