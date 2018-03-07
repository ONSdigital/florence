import notifications from '../../../utilities/notifications';

/**
 * 
 * @param {Error} metadataUpdateFailure - Any error responses returned by the metadata update request.
 * @param {Error} reviewStateUpdateFailure - Any error responses returned by the metadata update request.
 * @param {boolean} isSubmittingForReview - Whether the request was submitting the dataset/version for review.
 * @param {boolean} isMarkingAsReviewed - Whether the request was marking the dataset/version as reviewed.
 * @param {string} collection - Collection name that the user is updating the dataset/version in.
 * 
 * @returns {boolean} - Whether there were errors or not;
 */

export default function handleMetadataSaveErrors(metadataUpdateFailure = {}, reviewStateUpdateFailure = {}, isSubmittingForReview, isMarkingAsReviewed, collection) {

    if (reviewStateUpdateFailure.status === 401 || metadataUpdateFailure.status === 401) {
        // Handled by utility request function
        return true;
    }

    if (reviewStateUpdateFailure.status || metadataUpdateFailure.status) {
        const notification = {
            type: 'warning',
            message: getErrorMessage(reviewStateUpdateFailure, metadataUpdateFailure, isSubmittingForReview, isMarkingAsReviewed, collection),
            isDismissable: true
        };
        notifications.add(notification);
        return true;
    }

    return false;
}


function getErrorMessage(reviewStateUpdateFailure, metadataUpdateFailure, isSubmittingForReview, isMarkingAsReviewed, collection) {

    if (reviewStateUpdateFailure.status === 'FETCH_ERR' && !metadataUpdateFailure.status) {
        return `Unable to ${isSubmittingForReview ? 'submit for review' : ''}${isMarkingAsReviewed ? 'submit for approval' : ''} due to a network issue. Please check your internet connection and try again`;
    }
    
    if (metadataUpdateFailure.status === 'FETCH_ERR' && !reviewStateUpdateFailure.status) {
        return `Unable to save metadata updates due to a network issue. Please check your internet connection and try again`;
    }
    
    if (metadataUpdateFailure.status === 400) {
        return "Unable to save metadata updates due to a invalid values being submitted. Please check your updates for any issues and try again";
    }
    
    if (metadataUpdateFailure.status === 403) {
        return "Unable to save metadata updates because you do not have permission to edit this dataset's metadata";
    }

    if (reviewStateUpdateFailure.status === 403) {
        return `Unable to ${isSubmittingForReview ? 'submit for review' : ''}${isMarkingAsReviewed ? 'submit for approval' : ''} because you do not have the correct permissions`;
    }
    
    if (reviewStateUpdateFailure.status === 404) {
        return `Unable to ${isSubmittingForReview ? 'submit for review' : ''}${isMarkingAsReviewed ? 'submit for approval' : ''} because collection '${collection}' couldn't be found`;
    }
    
    if (metadataUpdateFailure.status === 404) {
        return `Unable to save metadata updates because this dataset couldn't be found`;
    }

    if (reviewStateUpdateFailure.status && !metadataUpdateFailure.status) {
        return `Unable to ${isSubmittingForReview ? 'submit for review' : ''}${isMarkingAsReviewed ? 'submit for approval' : ''} due to an unexpected error`;
    }
    
    if (reviewStateUpdateFailure.status && !metadataUpdateFailure.status) {
        return `Unable to save metadata changes due to an unexpected error`;
    }

    if (reviewStateUpdateFailure.status && metadataUpdateFailure.status) {
        return `Unable to save metadata changes and ${isSubmittingForReview ? 'submit for review' : ''}${isMarkingAsReviewed ? 'submit for approval' : ''} due to an unexpected error`;
    }

    return 'An unexpected error occured, some or all of your updates may not have been processed'
}