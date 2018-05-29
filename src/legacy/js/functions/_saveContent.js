/**
 * Save new content.
 * @param collectionId
 * @param uri
 * @param data - new content being posted for update
 * @param collectionData - JSON for collection
 */
function saveContent(collectionId, uri, data, collectionData) {
    postContent(collectionId, uri, JSON.stringify(data), false, false,
        success = function (message) {
            console.log("Updating completed " + message);
            createWorkspace(uri, collectionId, 'edit', collectionData);
        },
        error = function (response) {
            handleApiError(response);
        }
    );
}
