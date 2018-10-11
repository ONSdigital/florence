function deleteAPIDataset(collectionId, instanceId, success, error) {

    $.ajax({
        url: "/zebedee/collections/" + collectionId + "/datasets/" + instanceId,
        type: 'DELETE',
        success: function (response) {
            if (success)
                success(response);
        },
        error: function (response) {
            if (error) {
                error(response);
            } else {
                handleApiError(response);
            }
        }
    });
}