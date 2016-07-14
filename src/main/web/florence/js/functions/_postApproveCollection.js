function postApproveCollection(collectionId) {
    $.ajax({
        url: "/zebedee/approve/" + collectionId,
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        type: 'POST',
        success: function (response) {
            $('.over').remove();
            hidePanel(viewController('publish'));
        },
        error: function (response) {
            $('.over').remove();
            if (response.status === 409) {
                sweetAlert("Cannot approve this collection", "It contains files that have not been approved.");
            }
            else {
                handleApiError(response);
            }
        }
    });
}
