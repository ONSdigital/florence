// fully load the equations list from scratch
function loadEquationsList(collectionId, data) {
    var html = templates.workEditEquations(data);
    $('#equations').replaceWith(html);
    initialiseEquationList(collectionId, data);
    initialiseClipboard();
}

// refresh only the list of equations - leaving the container div that accordion works from.
function refreshEquationsList(collectionId, data) {
    var html = templates.workEditEquations(data);
    $('#equation-list').replaceWith($(html).find('#equation-list'));
    initialiseEquationList(collectionId, data);
    initialiseClipboard();
}

// do all the wiring up of buttons etc once the template has been rendered.
function initialiseEquationList(collectionId, data) {

    $('#add-equation').click(function () {
        loadEquationBuilder(data, function () {
            refreshPreview();

            putContent(collectionId, data.uri, JSON.stringify(data),
                success = function () {
                    Florence.Editor.isDirty = false;
                    refreshPreview();
                    refreshEquationsList(collectionId, data);
                },
                error = function (response) {
                    handleApiError(response);
                }
            );
        });
    });

    $(data.equations).each(function (index, equation) {

        var basePath = data.uri;
        var equationPath = basePath + '/' + equation.filename;
        var equationJson = equationPath;

        $("#equation-edit_" + index).click(function () {
            getPageData(collectionId, equationJson,
                onSuccess = function (equationData) {

                    loadEquationBuilder(data, function () {
                        refreshPreview();

                        putContent(collectionId, basePath, JSON.stringify(data),
                            success = function () {
                                Florence.Editor.isDirty = false;
                                refreshPreview();
                                refreshEquationList(collectionId, data);
                            },
                            error = function (response) {
                                handleApiError(response);
                            }
                        );
                    }, equationData);
                })
        });

        $("#equation-delete_" + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete this equation?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    $(this).parent().remove();
                    data.equations = _(data.equations).filter(function (item) {
                        return item.filename !== equation.filename
                    });
                    putContent(collectionId, basePath, JSON.stringify(data),
                        success = function () {
                            deleteEquation(collectionId, equationJson, onSuccess = function () {
                            }, onError = function () {
                            });
                            Florence.Editor.isDirty = false;
                            swal({
                                title: "Deleted",
                                text: "This equation has been deleted",
                                type: "success",
                                timer: 2000
                            });
                            refreshEquationsList(collectionId, data);
                        },
                        error = function (response) {
                            handleApiError(response);
                        }
                    );
                }
            });
        });
    });
    // Make sections sortable
    function sortable() {
        $('#sortable-equation').sortable();
    }

    sortable();
}


