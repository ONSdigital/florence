/**
 * Returns array of pages that have been deleted from website
 * @param onSuccess - callback for successful response
 */


function getDeletedPages(onSuccess) {
    $.ajax({
        url: "/zebedee/deletedcontent",
        type: 'GET',
        success: function(response) {
            onSuccess(response);
        },
        error: function(error) {
            handleApiError(error);
        }
    })
}
