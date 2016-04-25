function postApproveCollection(collectionId) {
    $.ajax({
        url: "/zebedee/approve/" + collectionId,
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        type: 'POST',
        success: function (response) {
            $('.over').remove();
            $('.collections-select-table tbody tr').removeClass('selected');
            $('.collection-selected').stop().animate({right: "-50%"}, 500, function() {
                viewController('publish');
            });
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
