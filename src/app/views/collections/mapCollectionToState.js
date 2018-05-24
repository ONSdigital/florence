import notifications from '../../utilities/notifications';
import log, {eventTypes} from '../../utilities/log';
import date from '../../utilities/date'

/**
* Function for mapping between request responses and the application's state
*/

export default function mapCollectionToState(collection) {
    try {
        const publishStates = mapPublishState(collection);
        return {
            id: collection.id,
            name: collection.name,
            publishDate: collection.publishDate,
            status: {
                neutral: publishStates.inProgress,
                warning: publishStates.thrownError,
                success: publishStates.completed,
                message: publishStates.message,
            },
            type: collection.type,
            selectableBox: {
                firstColumn: collection.name,
                secondColumn: readablePublishDate(collection)
            },
            canBeApproved: false,
            canBeDeleted: false,
            inProgress: collection.inProgress,
            complete: collection.complete,
            reviewed: collection.reviewed,
            teams: collection.teamsDetails ? collection.teamsDetails.map(team => ({
                id: team.id.toString(),
                name: team.name
            })) : [],
            deletes: collection.pendingDeletes
        }
    } catch (error) {
        const notification = {
            type: "warning",
            message: "Error whilst mapping list of collections to screen",
            isDismissable: true,
            autoDismiss: 3000
        }
        notifications.add(notification);
        console.error("Error mapping collections to component state: ", error);
        log.add(eventTypes.unexpectedRuntimeError, "Error mapping collections to component state: " + error);
        return false;
    }
}

function mapPublishState(collection) {
    const publishStates = {inProgress: false, thrownError: false, completed: false, notStarted: false, message: ""}
    try {
        switch (collection.approvalStatus) {
            case (undefined): {
                break;
            }
            case ('NOT_STARTED'): {
                publishStates.notStarted = true;
                break;
            }
            case ('IN_PROGRESS'): {
                publishStates.inProgress = true;
                publishStates.message = "preparing publish";
                break;
            }
            case ('COMPLETE'): {
                publishStates.completed = true;
                break;
            }
            case ('ERROR'): {
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

function readablePublishDate(collection) {
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