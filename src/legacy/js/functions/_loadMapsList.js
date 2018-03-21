function loadMapsList(collectionId, data) {
    var html = templates.workEditMaps(data);
    $('#maps').replaceWith(html);
    initialiseMapsList(collectionId, data);
    initialiseClipboard();
}

function refreshMapsList(collectionId, data) {
    var html = templates.workEditMaps(data);
    $('#map-list').replaceWith($(html).find('#map-list'));
    initialiseMapsList(collectionId, data);
    initialiseClipboard();
}

function initialiseMapsList(collectionId, data) {

    $('#add-map').click(function () {
        loadMapBuilder(data, function () {
            Florence.Editor.isDirty = false;
            refreshPreview();
            refreshMapsList(collectionId, data);
        });
    });

    $(data.maps).each(function (index, map) {
        var basePath = data.uri;
        var mapPath = basePath + '/' + map.filename;
        var mapJson = mapPath;

        $("#map-edit_" + index).click(function () {
            getPageData(collectionId, mapJson,
                onSuccess = function (mapData) {
                    let onSave = function () {
                        Florence.Editor.isDirty = false;
                        refreshPreview();
                        refreshMapsList(collectionId, data);
                    };
                    loadMapBuilder(data, onSave, mapData);
                })
        });

        $("#map-delete_" + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete this map?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    $(this).parent().remove();
                    // delete any files associated with the map.
                    var extraFiles = [map.filename + '.csv'];
                    _(extraFiles).each(function (file) {
                        var fileToDelete = basePath + '/' + file;
                        deleteContent(collectionId, fileToDelete,
                            onSuccess = function () {
                            },
                            onError = function (error) {
                            });
                    });

                    // remove the map from the page json when its deleted
                    data.maps = _(data.maps).filter(function (item) {
                        return item.filename !== map.filename
                    });
                    // save the updated page json
                    putContent(collectionId, basePath, JSON.stringify(data),
                        success = function () {

                            // delete the map json file
                            deleteContent(collectionId, mapJson + '.json', onSuccess = function () {
                            }, onError = function (error) {
                            });

                            Florence.Editor.isDirty = false;
                            refreshMapsList(collectionId, data);

                            swal({
                                title: "Deleted",
                                text: "This map has been deleted",
                                type: "success",
                                timer: 2000
                            });
                        },
                        error = function (response) {
                            if (response.status !== 404)
                                handleApiError(response);
                        }
                    );


                }
            });
        });
    });
    // Make sections sortable
    function sortable() {
        $('#sortable-map').sortable();
    }

    sortable();
}