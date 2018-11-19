import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';

import datasets from '../../utilities/api-clients/datasets';
import notifications from '../../utilities/notifications';
import url from '../../utilities/url'

import SimpleSelectableList from '../../components/simple-selectable-list/SimpleSelectableList';
import Input from '../../components/Input';

const propTypes = {

}

export class DatasetsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingDatasets: false,
            datasets: [],
            filteredDatasets: [],
            searchTerm: ""
        }

    }

    componentWillMount() {
        return this.getAllDatasets();
    }

    getAllDatasets() {
        this.setState({isFetchingDatasets: true});
        return datasets.getAll().then(datasets => {
            this.setState({
                isFetchingDatasets: false, 
                datasets: this.mapDatasetsToState(datasets.items)
            })
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "neutral",
                        "message": "You do not permission to view submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case(404):{
                    const notification = {
                        "type": "warning",
                        "message": "No API route available to get all submitted datasets",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("RESPONSE_ERR"):{
                    const notification = {
                        "type": "warning",
                        "message": "An error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification)
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get the submitted datasets. Please check you internet connection and try again in a few moments.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error has occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get the submitted datasets.",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error getting datasets:\n", error);
            this.setState({isFetchingDatasets: false});
        });
    }

    handleBackButton = () => {
        const previousUrl = url.resolve("../");
        this.props.dispatch(push(previousUrl));
    }

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredDatasets = this.state.datasets.filter(dataset => {
            return (
                dataset.title.toLowerCase().search(searchTerm) !== -1
            );
        });
        this.setState({
            filteredDatasets,
            searchTerm
        });
    }

    mapDatasetsToState = datasets => {
        try {
            return datasets.map(dataset => {
                dataset = dataset.current || dataset.next || dataset;
                return {
                    title: dataset.title, 
                    id: dataset.id,
                    url: this.props.location.pathname + "/" + dataset.id
                }
            })
        } catch (error) {
            const notification = {
                type: "warning",
                message: "An unexpected error occurred when trying to get dataset, so some functionality in Florence may not work as expected. Try refreshing the page",
                isDismissable: true
            }
            notifications.add(notification);
            console.error("Error mapping datasets to state:\n", error);
        }
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664; <button type="button" className="btn btn--link" onClick={this.handleBackButton}>Back</button>
                    </div>
                    <h1 className="margin-top--1 margin-bottom--1">Select a dataset</h1>
                    <Input id="search-datasets" placeholder="Search by name or ID" onChange={this.handleSearchInput}/>
                    <SimpleSelectableList 
                        rows={this.state.filteredDatasets.length ? this.state.filteredDatasets : this.state.datasets} 
                        isFetchingData={this.state.isFetchingDatasets}
                    />
               </div>
            </div>
        )
    }
}

DatasetsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        
    }
}
export default connect(mapStateToProps)(DatasetsController);

