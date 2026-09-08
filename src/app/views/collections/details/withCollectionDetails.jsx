import React, { Component } from "react";
import { connect } from "react-redux";
import { replace } from "connected-react-router";
import { updateWorkingOn } from "../../../config/actions";
import log from "../../../utilities/logging/log";
import collections from "../../../utilities/api-clients/collections";
import notifications from "../../../utilities/notifications";
import PropTypes from "prop-types";

const mapCollectionResponseToWorkingOnState = (collection, rootPath, collectionID) => {
    log.event("collection response to 'working on' state");
    try {
        return {
            id: collection.id,
            name: collection.name,
            url: `${rootPath}/collections/${collection.id}`,
            error: false,
        };
    } catch (error) {
        log.event(
            "error mapping collection response to 'working on' state",
            log.error(error),
            log.data({
                collectionID,
            })
        );
        console.error("error mapping collection response to 'working on' state", error);
        const notification = {
            type: "warning",
            message: "An unexpected error occurred whilst getting details about this collection, please refresh the page",
            autoDismiss: 5000,
        };
        notifications.add(notification);
        return {
            error: true,
        };
    }
};

export function withCollectionDetails(WrappedComponent) {
    class CollectionDetailsWrapper extends Component {
        static propTypes = {
            match: PropTypes.shape({
                params: PropTypes.shape({
                    collectionID: PropTypes.string.isRequired,
                }).isRequired,
            }).isRequired,
            dispatch: PropTypes.func.isRequired,
            workingOn: PropTypes.shape(),
            rootPath: PropTypes.string.isRequired,
        };

        componentDidMount() {
            this.getCollectionDetails();
        }

        componentDidUpdate(prevProps) {
            if (prevProps.match.params.collectionID !== this.props.match.params.collectionID) {
                this.getCollectionDetails();
            }
        }

        getCollectionDetails = () => {
            const collectionID = this.props.match.params.collectionID;

            if (!collectionID) {
                const notification = {
                    type: "neutral",
                    message: "The collection you're working on couldn't be determined so you've been redirected to the collections screen",
                    autoDismiss: 5000,
                };
                notifications.add(notification);
                this.props.dispatch(replace(`${this.props.rootPath}/collections`));
                return;
            }

            if (this.props.workingOn?.id === collectionID) {
                return;
            }

            collections
                .get(collectionID)
                .then(response => {
                    const mappedState = mapCollectionResponseToWorkingOnState(response, this.props.rootPath, collectionID);
                    this.props.dispatch(updateWorkingOn(mappedState.id, mappedState.name, mappedState.url, response, mappedState.error));
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
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            this.props.dispatch(replace(`${this.props.rootPath}/collections`));
                            break;
                        }
                        case 403: {
                            const notification = {
                                type: "neutral",
                                message: "You don't have permissions to access this collection so you've been redirected to the collections screen",
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            this.props.dispatch(replace(`${this.props.rootPath}/collections`));
                            break;
                        }
                        case "FETCH_ERR": {
                            const notification = {
                                type: "warning",
                                message:
                                    "There was a network error whilst getting details about this collection, please check your connection and refresh the page",
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            break;
                        }
                        default: {
                            const notification = {
                                type: "warning",
                                message: "An unexpected error occurred whilst getting details about this collection, please refresh the page",
                                autoDismiss: 5000,
                            };
                            notifications.add(notification);
                            break;
                        }
                    }
                });
        };

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {
            workingOn: state.state.global.workingOn,
            rootPath: state.state.rootPath,
        };
    }

    return connect(mapStateToProps)(CollectionDetailsWrapper);
}
