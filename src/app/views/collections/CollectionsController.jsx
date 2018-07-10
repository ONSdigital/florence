import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

import CollectionCreateController from './create/CollectionCreateController';
import {pagePropTypes} from './details/CollectionDetails';
import collections from '../../utilities/api-clients/collections';
import { emptyActiveCollection , addAllCollections} from '../../config/actions';
import notifications from '../../utilities/notifications';
import DoubleSelectableBoxController from '../../components/selectable-box/double-column/DoubleSelectableBoxController';
import CollectionDetailsController from './details/CollectionDetailsController';
import collectionMapper from './mapper/collectionMapper';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.shape({
        collectionID: PropTypes.string
    }).isRequired,
    user: PropTypes.object.isRequired,
    collections: PropTypes.array,
    activeCollection: PropTypes.shape({
        inProgress: PropTypes.arrayOf(PropTypes.shape(pagePropTypes)),
        id: PropTypes.string.isRequired,
    }),
    routes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export class CollectionsController extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isFetchingCollections: false
        };

        this.handleCollectionSelection = this.handleCollectionSelection.bind(this);
        this.handleCollectionCreateSuccess = this.handleCollectionCreateSuccess.bind(this);
    }

    componentWillMount() {
        this.fetchCollections();
    }

    componentWillUnmount() {
        this.props.dispatch(emptyActiveCollection());
    }

    fetchCollections() {
        this.setState({isFetchingCollections: true});
        collections.getAll().then(collections => {
            const allCollections = collections.filter(collection => {
                return collection.approvalStatus !== "COMPLETE";
            }).map(collection => {
                return collectionMapper.collectionResponseToState(collection)
            });
            this.props.dispatch(addAllCollections(allCollections));
            this.setState({isFetchingCollections: false});
        }).catch(error => {
            switch(error.status) {
                case(401): {
                    // This is handled by the request function, so do nothing here
                    break;
                }
                case(404): {
                    const notification = {
                        type: 'warning',
                        message: `No API route available to get collections.`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case(403): {
                    const notification = {
                        type: 'warning',
                        message: `You don't have permissions to view collections`,
                        autoDismiss: 5000
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(`${this.props.rootPath}/collections`));
                    break;
                }
                case("RESPONSE_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An error's occurred whilst trying to get collections. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("UNEXPECTED_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get collections. You may only be able to see previously loaded information but won't be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
                case("FETCH_ERR"): {
                    const notification = {
                        type: "warning",
                        message: "There's been a network error whilst trying to get collections. You may only be able to see previously loaded information and not be able to edit any team members",
                        isDismissable: true
                    };
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error fetching all collections:\n", error);
        });
    }

    handleCollectionCreateSuccess(newCollection) {
        let mappedCollection = collectionMapper.collectionResponseToState(newCollection);
        const collections = [...this.props.collections, mappedCollection];
        this.props.dispatch(addAllCollections(collections));
        this.props.dispatch(push(`${this.props.rootPath}/collections/${mappedCollection.id}`));
        this.fetchCollections();

        // scroll to newly created collection
        const element = document.getElementById(mappedCollection.id).getBoundingClientRect();
        document.getElementById('selectable-box').scrollTop = element.top;
    }

    handleCollectionSelection(collection) {
        this.props.dispatch(push(`${this.props.rootPath}/collections/${collection.id}`));
    }

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a collection</h1>
                        <DoubleSelectableBoxController
                            items={this.props.collections}
                            activeItemID={this.props.params.collectionID}
                            isUpdating={this.state.isFetchingCollections}
                            headings={["Name", "Publish date"]}
                            handleItemClick={this.handleCollectionSelection}
                        />
                    </div>
                    <div className="grid__col-4">
                        <h1>Create a collection</h1>
                        <CollectionCreateController user={this.props.user} onSuccess={this.handleCollectionCreateSuccess}  />
                    </div>
                </div>
                <CollectionDetailsController collectionID={this.props.params.collectionID} routes={this.props.routes}/>
            </div>
        )
    }
}

CollectionsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        user: state.state.user,
        collections: state.state.collections.all,
        activeCollection: state.state.collections.active,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(CollectionsController);