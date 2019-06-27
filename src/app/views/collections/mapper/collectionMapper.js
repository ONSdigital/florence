import notifications from "../../../utilities/notifications";
import log from "../../../utilities/logging/log";
import date from "../../../utilities/date";

/**
 * Methods for mapping between request responses and the application's state
 */

export default class collectionMapper {
    static collectionResponseToState(collection) {
        try {
            const publishStates = this.publishState(collection);
            return {
                id: collection.id,
                name: collection.name,
                publishDate: collection.publishDate,
                status: {
                    neutral: publishStates.inProgress,
                    warning: publishStates.thrownError,
                    success: publishStates.completed,
                    message: publishStates.message
                },
                type: collection.type,
                isForcedManualType: this.isForcedManualType(collection), // the collection has been made 'manual' programatically because 'scheduled' wasn't possible
                release: collection.releaseUri,
                selectableBox: {
                    firstColumn: collection.name,
                    secondColumn: this.publishDate(collection)
                },
                canBeApproved: false,
                canBeDeleted: false,
                inProgress: collection.inProgress,
                complete: collection.complete,
                reviewed: collection.reviewed,
                datasets: collection.datasets,
                datasetVersions: collection.datasetVersions,
                teams: collection.teamsDetails
                    ? collection.teamsDetails.map(team => ({
                          id: team.id.toString(),
                          name: team.name
                      }))
                    : [],
                deletes: collection.pendingDeletes
            };
        } catch (error) {
            const notification = {
                type: "warning",
                message: "Error whilst mapping list of collections to screen",
                isDismissable: true,
                autoDismiss: 3000
            };
            notifications.add(notification);
            console.error("Error mapping collections to component state: ", error);
            log.event("Error mapping collections to component state", log.error(error));
            return false;
        }
    }

    static pagesToCollectionState(collection) {
        try {
            const canBeApproved = this.collectionCanBeApproved(collection);
            const canBeDeleted = this.collectionCanBeDeleted(collection);
            const mapPageToState = pagesArray => {
                if (!pagesArray) {
                    log.event("Collections pages array (e.g. inProgress) wasn't set, had to hardcode a default value of null", log.warn());
                    return null;
                }
                return pagesArray.map(page => {
                    let updatedPage = {};
                    try {
                        updatedPage = {
                            lastEdit: {
                                email: page.events && page.events.length > 0 ? page.events[0].email : "",
                                date: page.events && page.events.length > 0 ? page.events[0].date : ""
                            },
                            title: page.description.title,
                            edition: page.description.edition || "",
                            uri: page.uri,
                            type: page.type
                        };
                    } catch (error) {
                        log.event("Error mapping a page to Florence's state", log.error(error));
                        console.error("Error mapping a page to Florence's state", error);
                    }
                    return updatedPage;
                });
            };
            const collectionWithPages = {
                ...collection,
                canBeApproved,
                canBeDeleted,
                inProgress: mapPageToState(collection.inProgress),
                complete: mapPageToState(collection.complete),
                reviewed: mapPageToState(collection.reviewed)
            };
            const collectionWithDatasetsAndPages = this.datasetsToCollectionState(collectionWithPages);
            return {
                ...collectionWithDatasetsAndPages,
                canBeDeleted: this.collectionCanBeDeleted(collectionWithDatasetsAndPages),
                canBeApproved: this.collectionCanBeApproved(collectionWithDatasetsAndPages)
            };
        } catch (error) {
            log.event("Error mapping collection GET response to Florence's state", log.error(error));
            console.error("Error mapping collection GET response to Florence's state", error);
            return null;
        }
    }

    static datasetsToCollectionState(collection) {
        try {
            const mapVersion = version => ({
                title: version.title,
                edition: version.edition,
                version: version.version,
                datasetID: version.id,
                id: `${version.id}/editions/${version.edition}/versions/${version.version}`,
                type: "dataset_version",
                uri: `/datasets/${version.id}/editions/${version.edition}/versions/${version.version}`,
                lastEditedBy: version.lastEditedBy
            });

            const mapDataset = dataset => ({
                title: dataset.title,
                type: "dataset_details",
                id: dataset.id,
                uri: `/datasets/${dataset.id}`,
                lastEditedBy: dataset.lastEditedBy
            });

            const mapDatasets = () => {
                let inProgress = collection.inProgress || [];
                let complete = collection.complete || [];
                let reviewed = collection.reviewed || [];

                if (collection.datasetVersions) {
                    collection.datasetVersions.forEach(version => {
                        if (version.state === "InProgress") {
                            inProgress.push(mapVersion(version));
                        }
                        if (version.state === "Complete") {
                            complete.push(mapVersion(version));
                        }
                        if (version.state === "Reviewed") {
                            reviewed.push(mapVersion(version));
                        }
                    });
                }

                if (collection.datasets) {
                    collection.datasets.forEach(dataset => {
                        if (dataset.state === "InProgress") {
                            inProgress.push(mapDataset(dataset));
                        }
                        if (dataset.state === "Complete") {
                            complete.push(mapDataset(dataset));
                        }
                        if (dataset.state === "Reviewed") {
                            reviewed.push(mapDataset(dataset));
                        }
                    });
                }

                return { inProgress, complete, reviewed };
            };

            return { ...collection, ...mapDatasets() };
        } catch (error) {
            log.event("Error mapping collection datasets response to Florence's state", log.error(error));
            console.error("Error mapping collection datasets response to Florence's state", error);
            return null;
        }
    }

    static isForcedManualType(collection) {
        if (collection.publishDate && collection.type === "manual") {
            return true;
        }

        return false;
    }

    static publishState(collection) {
        const publishStates = {
            inProgress: false,
            thrownError: false,
            completed: false,
            notStarted: false,
            message: ""
        };
        try {
            switch (collection.approvalStatus) {
                case undefined: {
                    break;
                }
                case "NOT_STARTED": {
                    publishStates.notStarted = true;
                    break;
                }
                case "IN_PROGRESS": {
                    publishStates.inProgress = true;
                    publishStates.message = "preparing publish";
                    break;
                }
                case "COMPLETE": {
                    publishStates.completed = true;
                    break;
                }
                case "ERROR": {
                    publishStates.thrownError = true;
                    publishStates.message = "error whilst preparing publish";
                    break;
                }
            }
            return publishStates;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static publishDate(collection) {
        if (collection.publishDate && collection.type === "manual") {
            return date.format(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT") + " [rolled back]";
        }

        if (collection.publishDate) {
            return date.format(collection.publishDate, "ddd, dd/mm/yyyy h:MMTT");
        }

        if (!collection.publishDate) {
            return "[manual collection]";
        }
    }

    static collectionCanBeApproved(collection) {
        // One of the lists doesn't have a value, so we can't verify whether it can be
        // deleted or not. Therefore it's safer to not allow approval
        if (!collection.inProgress || !collection.complete || !collection.reviewed || !collection.deletes) {
            return false;
        }

        if (collection.reviewed.length >= 1 && collection.inProgress.length === 0 && collection.complete.length === 0) {
            return true;
        }

        if (collection.deletes.length >= 1 && collection.inProgress.length === 0 && collection.complete.length === 0) {
            return true;
        }

        // We shouldn't get to this return but we'll return false by default because it's safer to disallow
        // approval rather than approve something in a unexpected state
        return false;
    }

    static collectionCanBeDeleted(collection) {
        // One of the lists doesn't have a value, so we can't verify whether it can be
        // deleted or not. Therefore it's safer to not allow approval
        if (!collection.inProgress || !collection.complete || !collection.reviewed || !collection.deletes) {
            return false;
        }

        if (collection.reviewed.length === 0 && collection.inProgress.length === 0 && collection.complete.length === 0 && collection.deletes.length === 0) {
            return true;
        }

        // We shouldn't get to this return but we'll return false by default because it's safer to disallow
        // approval rather than approve something in a unexpected state
        return false;
    }

    // Used for getting all pages in a collection minus the pages that user has requested to be deleted
    // from a collection (but haven't actually been sent to the API yet because allow an 'undo' ability)
    static pagesExcludingPendingDeletedPages(pages, pendingDeletesPages) {
        if (!pages) {
            return;
        }

        if (!pendingDeletesPages || pendingDeletesPages.length === 0) {
            return pages;
        }

        return pages.filter(page => {
            return !pendingDeletesPages.includes(page.uri);
        });
    }
}
