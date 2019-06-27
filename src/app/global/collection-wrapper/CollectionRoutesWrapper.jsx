import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { replace } from "react-router-redux";

import { updateWorkingOn } from "../../config/actions";

import log from "../../utilities/logging/log";
import collections from "../../utilities/api-clients/collections";
import notifications from "../../utilities/notifications";

const propTypes = {
    params: PropTypes.shape({
        collectionID: PropTypes.string.isRequired
    }),
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    rootPath: PropTypes.string.isRequired,
    workingOn: PropTypes.shape(),
    children: PropTypes.element
};

export class CollectionRoutesWrapper extends Component {
    componentDidMount = () => {
        const collectionID = this.props.params.collectionID;
        if (!collectionID) {
            this.props.dispatch(replace(`${this.props.rootPath}/collections`));
            return;
        }
        if (this.props.workingOn) {
            return;
        }
        this.getCollectionDetails(collectionID);
    };

    getCollectionDetails = collectionID => {
        return collections
            .get(collectionID)
            .then(response => {
                const workingOn = this.mapCollectionResponseToWorkingOnState(response);
                this.props.dispatch(updateWorkingOn(workingOn.id, workingOn.name, workingOn.url, response, workingOn.error));
            })
            .catch(error => {
                switch (error.status) {
                    case 401: {
                        // do nothing - this is handled by the request function itself
                        break;
                    }
                    case 404: {
                        const notification = {
                            type: "neutral",
                            message: "The collection couldn't be found so you've been redirected to the collections screen",
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        this.props.dispatch(replace(`${this.props.rootPath}/collections`));
                        break;
                    }
                    case 403: {
                        const notification = {
                            type: "neutral",
                            message: "You don't have permissions to access this collection so you've been redirect to the collections screen",
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        this.props.dispatch(replace(`${this.props.rootPath}/collections`));
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message: "There was a network error whilst getting details about this collection, please check your connection and refresh the page",
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        const notification = {
                            type: "warning",
                            message: "An unexpected error occurred whilst getting details about this collection, please refresh the page",
                            autoDismiss: 5000
                        };
                        notifications.add(notification);
                        break;
                    }
                }
            });
    };

    mapCollectionResponseToWorkingOnState = collection => {
        log.event("collection response to 'working on' state");
        try {
            return {
                id: collection.id,
                name: collection.name,
                url: `${this.props.rootPath}/collections/${collection.id}`,
                error: false
            };
        } catch (error) {
            log.event(
                "error mapping collection response to 'working on' state",
                log.error(error),
                log.data({
                    collectionID: this.props.params.collectionID,
                    url: this.props.location.pathname
                })
            );
            console.error("error mapping collection response to 'working on' state", error);
            const notification = {
                type: "warning",
                message: "An unexpected error occurred whilst getting details about this collection, please refresh the page",
                autoDismiss: 5000
            };
            notifications.add(notification);
            return {
                error: true
            };
        }
    };

    render = () => {
        return <div>{this.props.children}</div>;
    };
}

CollectionRoutesWrapper.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        workingOn: state.state.global.workingOn,
        rootPath: state.state.rootPath
    };
}

export default connect(mapStateToProps)(CollectionRoutesWrapper);
