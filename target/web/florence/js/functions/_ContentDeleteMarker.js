function addDeleteMarker(uri, title, success) {

    var deleteTarget = {
        uri: uri,
        user: localStorage.getItem('loggedInAs'),
        title: title,
        collectionId: Florence.collection.id
     };

    $.ajax({
        url: "/zebedee/DeleteContent/",
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
        url: "/zebedee/DeleteContent/" + Florence.collection.id + "?uri=" + uri,
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
