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

    componentWillMount() {
        this.getAllUsers();
    }

    getAllUsers() {
        this.setState({isFetchingUsers: true})
        users.getAll()
            .then(allUsersResponse => {
                const allUsers = allUsersResponse.map(user => {
                    return this.mapUserToState(user)
                })
                this.setState({allUsers, isFetchingUsers: false})
            }).catch(error => {
                // TODO handle errors properly
                console.error(`Error getting all users`, error)
                this.setState({isFetchingUsers: false})
            })
            
    }

    mapUserToState(user) {
        const id = user.email;
        const columnValues = [user.name, user.email]
        const returnValue = {id: user.email}
        return {...user, id, columnValues, returnValue};
    }

    handleUserSelection(user) {
        console.log(user)
    }

    render() {
        return (
            <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a user</h1>
                        <SelectableBox 
                            columns={[{heading: "User", width: "6"}, {heading: "Email", width: "6"}]}
                            rows={this.state.allUsers}
                            isUpdating={this.state.isFetchingUsers}
                            handleItemClick={this.handleUserSelection}
                        
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