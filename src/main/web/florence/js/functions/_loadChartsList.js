// fully load the charts list from scratch
function loadChartsList(collectionId, data) {
    var html = templates.workEditCharts(data);
    $('#charts').replaceWith(html);
    initialiseChartList(collectionId, data);
    initialiseClipboard();
}

// refresh only the list of charts - leaving the container div that accordion works from.
function refreshChartList(collectionId, data) {
    var html = templates.workEditCharts(data);
    $('#chart-list').replaceWith($(html).find('#chart-list'));
    initialiseChartList(collectionId, data);
}

// Copy chart markdown to clipboard (clipboard.js plugin)
var clipboard = null;
function initialiseClipboard() {
    var i;

    // Remove any existing clipboard variables
    if (clipboard != null) {
        console.log("Destroy clipboard");
        clipboard.destroy();
    }

    // Fire normal clipboard initialisation
    clipboard = new Clipboard('.chart-copy', {
        target: function(trigger) {
            i = $(trigger).closest('.edit-section__sortable-item').attr('id');
            return document.getElementById('copy-chart-markdown_' + i);
        }
    });
    clipboard.on('success', function(e) {
        toggleTick(i, "show");
        setTimeout(function() {
            toggleTick(i, "hide")
        }, 2000);
        console.log('Trigger: ', e.trigger);
        console.log('Text: ', e.text);
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        console.log("Error copying chart markdown");
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    // Switch 'done' tick on and off
    function toggleTick(i, state) {
        if (state == "show") {
            $("#chart-copy_" + i).attr("style", "color:transparent;");
        }
        $(".trigger_" + i).toggleClass("drawn");
        if (state == "hide") {
            function showBtnText () { $("#chart-copy_" + i).removeAttr("style");}
            setTimeout(showBtnText, 1600);
        }
    }
}

// do all the wiring up of buttons etc once the template has been rendered.
function initialiseChartList(collectionId, data) {

    $('#add-chart').click(function () {
        loadChartBuilder(data, function () {
            refreshPreview();

            putContent(collectionId, data.uri, JSON.stringify(data),
                success = function () {
                    Florence.Editor.isDirty = false;
                    refreshPreview();
                    refreshChartList(collectionId, data);
                },
                error = function (response) {
                    handleApiError(response);
                }
            );
        });
    });

    $(data.charts).each(function (index, chart) {

        var basePath = data.uri;
        var chartPath = basePath + '/' + chart.filename;
        var chartJson = chartPath;

        $("#chart-edit_" + index).click(function () {
            getPageData(collectionId, chartJson,
                onSuccess = function (chartData) {

                    loadChartBuilder(data, function () {
                        refreshPreview();

                        putContent(collectionId, basePath, JSON.stringify(data),
                            success = function () {
                                Florence.Editor.isDirty = false;
                                refreshPreview();
                                refreshChartList(collectionId, data);
                            },
                            error = function (response) {
                                handleApiError(response);
                            }
                        );
                    }, chartData);
                })
        });

        $("#chart-delete_" + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete this chart?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {
                    $(this).parent().remove();
                    data.charts = _(data.charts).filter(function (item) {
                        return item.filename !== chart.filename
                    });
                    putContent(collectionId, basePath, JSON.stringify(data),
                        success = function () {
                            deleteContent(collectionId, chartJson + '.json', onSuccess = function () {
                            }, onError = function () {
                            });
                            Florence.Editor.isDirty = false;
                            swal({
                                title: "Deleted",
                                text: "This chart has been deleted",
                                type: "success",
                                timer: 2000
                            });
                            refreshChartList(collectionId, data);
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
        $('#sortable-chart').sortable();
    }

    sortable();
}


