function createCollection(teams) {

    var publishTime, collectionId, collectionDate, releaseUri;
    collectionId = $('#collectionname').val();
    var publishType = $('input[name="publishType"]:checked').val();
    var scheduleType = $('input[name="scheduleType"]:checked').val();

    if (publishType === 'scheduled') {
        publishTime = parseInt($('#hour').val()) + parseInt($('#min').val());
        var toIsoDate = $('#date').datepicker("getDate");
        collectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
    } else {
        collectionDate = null;
    }

    if (scheduleType === 'release' && publishType === 'scheduled') {
        if (!Florence.CreateCollection.selectedRelease) {
            sweetAlert('Please select a release');
            return true;
        }
        releaseUri = Florence.CreateCollection.selectedRelease.uri;
    } else {
        releaseUri = null;
    }

    // inline tests
    if (collectionId === '') {
        sweetAlert('This is not a valid collection name', "A collection name can't be empty");
        return true;
    }
    if (collectionId.match(/\./)) {
        sweetAlert('This is not a valid collection name', "You can't use fullstops");
        return true;
    }
    if ((publishType === 'scheduled') && (scheduleType === 'custom') && (isValidDate(new Date(collectionDate)))) {
        sweetAlert('This is not a valid date');
        return true;
    }
    if ((publishType === 'scheduled') && (scheduleType === 'custom') && (Date.parse(collectionDate) < new Date())) {
        sweetAlert('This is not a valid date');
        return true;
    } else {

        // Add loading icon to button
        loadingBtn($('.btn-collection-create'));

        // Create the collection
        $.ajax({
            url: "/zebedee/collection",
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                name: collectionId,
                type: publishType,
                publishDate: collectionDate,
                pendingDeletes: [],
                teams: teams,
                releaseUri: releaseUri
            }),
            success: function (collection) {
                viewCollectionDetails(collection.id);
            },
            error: function (response) {
                if (response.status === 409) {
                    sweetAlert("Error", response.responseJSON.message, "error");
                }
                else {
                    handleApiError(response);
                }
            }
        });
    }
}

function isValidDate(d) {
    if (!isNaN(d.getTime())) {
        return false;
    }
    return true;
}

