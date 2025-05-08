function postApproveCollection(collectionId) {
    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/approve/${collectionId}`,
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        type: 'POST',
        success: function () {
            hidePanel({onHide: function(){
                    // Select collections tab
                    viewController('collections')
                }
            });
        },
        error: function (response) {
            if (response.status === 409) {
                sweetAlert("Cannot approve this collection", "It contains files that have not been approved.");
            }
            else {
                handleApiError(response);
            }
        }
    });
}
