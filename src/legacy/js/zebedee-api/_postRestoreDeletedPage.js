/**
 * Restores a delete page (and any sub-pages) into a collection
 * @param deleteID - Unique identifier of deletion that is being restored
 * @param collectionId - Collection to put the restored page/s into
 * @param onSuccess - Callback on successful response
 */

function postRestoreDeletedPage(deleteID, collectionId, onSuccess) {
    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/deletedcontent/${deleteID}?collectionid=${collectionId}`,
        type: "POST",
        success: function(response) {
            onSuccess(response);
        },
        error: function(error) {
            handleApiError(error);
        }
    })
}
