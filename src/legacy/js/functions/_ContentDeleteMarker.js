function addDeleteMarker(uri, title, success) {

    var deleteTarget = {
        uri: uri,
        user: localStorage.getItem('loggedInAs'),
        title: title,
        collectionId: Florence.collection.id
     };

    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/DeleteContent/`,
        type: 'POST',
        data: JSON.stringify(deleteTarget),
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (response) {
            if (success)
                success(response);
        },
        error: function (response) {
            handleApiError(response);
        }
    });
}

function removeDeleteMarker(uri, success) {
    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/DeleteContent/${Florence.collection.id}?uri=${uri}`,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (response) {
            if (success)
                success(response);
        },
        error: function (response) {
            handleApiError(response);
        }
    });
}
