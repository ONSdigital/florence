import React, { Component } from 'react';
import PropTypes from 'prop-types';

import users from '../../utilities/api-clients/user';

import SelectableBox from '../../components/selectable-box-new/SelectableBox';

// UsersController.propTypes = {

// };


class UsersController extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isFetchingUsers: false,
            allUsers: []
        }
    }

    render() {
        return (
            <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a user</h1>
                        <SelectableBox 
                            columns={[{heading: "User", width: "4"}, {heading: "Email", width: "4"}]}
                            rows={this.state.allUsers}
                            isUpdating={this.state.isFetchingUsers}
                            handleItemClick={function(){}}
                        
                        />
                    </div>

                    <div className="grid__col-4">
                        <h1>Create a user</h1>
                    </div>
                
            </div>
        );
    }
}


export default UsersController;