function loadTablesList(collectionId, data) {
    var html = templates.workEditTables(data);
    $('#tables').replaceWith(html);
    initialiseTablesList(collectionId, data);
    initialiseClipboard();
}

function refreshTablesList(collectionId, data) {
    var html = templates.workEditTables(data);
    $('#table-list').replaceWith($(html).find('#table-list'));
    initialiseTablesList(collectionId, data);
    initialiseClipboard();
}

function initialiseTablesList(collectionId, data) {

    $('#add-table-v2').click(function () {
        loadTableBuilderV2(data, function () {
            Florence.Editor.isDirty = false;
            refreshPreview();
            refreshTablesList(collectionId, data);
        });
    });

    $(data.tables).each(function (index, table) {
        var basePath = data.uri;
        var tablePath = basePath + '/' + table.filename;
        var tableJson = tablePath;

        $("#table-edit_" + index).click(function () {
            getPageData(collectionId, tableJson,
                onSuccess = function (tableData) {
                    let onSave = function () {
                        Florence.Editor.isDirty = false;
                        refreshPreview();
                        refreshTablesList(collectionId, data);
                    };

                    loadTableBuilderV2(data, onSave, tableData);

                })
        });

        $("#table-delete_" + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete this table?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    $(this).parent().remove();
                    // delete any files associated with the table.
                    var extraFiles = [table.filename + '.html', table.filename + '.xls'];
                    _(extraFiles).each(function (file) {
                        var fileToDelete = basePath + '/' + file;
                        deleteContent(collectionId, fileToDelete,
                            onSuccess = function () {
                            },
                            onError = function (error) {
                            });
                    });

                    // remove the table from the page json when its deleted
                    data.tables = _(data.tables).filter(function (item) {
                        return item.filename !== table.filename
                    });
                    // save the updated page json
                    putContent(collectionId, basePath, JSON.stringify(data),
                        success = function () {

                            // delete the table json file
                            deleteContent(collectionId, tableJson + '.json', onSuccess = function () {
                            }, onError = function (error) {
                            });

                            Florence.Editor.isDirty = false;
                            refreshTablesList(collectionId, data);

                            swal({
                                title: "Deleted",
                                text: "This table has been deleted",
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
        $('#sortable-table').sortable();
    }

    sortable();
}