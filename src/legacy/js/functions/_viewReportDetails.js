/**
 * Display panel with selected report's details
 *
 * @param collection = selected collection data object
 * @param isPublished = boolean flag of whether selected collection is published or not
 * @param $this = jQuery object of selected item from table
 */

function viewReportDetails(collection, isPublished, $this) {

    // Enum type of filterable data
    const filterableReportType = {
        'dataset': 0,
        'datasetVersion': 1
    };

    // Retrieve all information for a specific type of filterable data report
    function getFilterableReportData(filterableDataTypeToUse, fullDatasetCollectionData) {
        let listOfReportData = [];

        // Retrieve all mandatory information fields for filterable data report
        function getMandatoryFilterableReportInformation(datasetCollectionItem) {
            const url = new URL(datasetCollectionItem.uri);
            return {
                uri: url.pathname
            };
        }

        if (fullDatasetCollectionData != null) {
            switch (filterableDataTypeToUse) {
                case filterableReportType.dataset:
                case filterableReportType.datasetVersion:
                    fullDatasetCollectionData.forEach((datasetCollectionItem) => {
                        let singleReportItem = getMandatoryFilterableReportInformation(datasetCollectionItem);
                        listOfReportData.push(singleReportItem)
                    });
                    break;
            }
        }
        return listOfReportData;
    }


    let details;

    // get the event details
    $.ajax({
        url: "/zebedee/collectionHistory/" + collection.id,
        type: "get",
        crossDomain: true,
        success: function (events) {
            // format eventDate to user readable date
            $(events).each(function (i) {
                var formattedDate = events[i].eventDetails.date;
                events[i].formattedDate = StringUtils.formatIsoFull(formattedDate);
            });

            if (isPublished) {


                $.ajax({
                    url: "/zebedee/publishedCollections/" + collection.id,
                    type: "GET",
                    crossDomain: true,
                    success: function (collection) {
                        var collection = collection[0];

                        var date = collection.publishEndDate;
                        collection.formattedDate = StringUtils.formatIsoFull(date);

                        // Load details with published data
                        if (!collection.publishResults || collection.publishResults.length === 0) {
                            return;
                        }

                        const success = collection.publishResults[collection.publishResults.length - 1];
                        const datasets = getFilterableReportData(filterableReportType.dataset, collection.datasets);
                        const datasetVersions = getFilterableReportData(filterableReportType.datasetVersion, collection.datasetVersions);

                        var duration = (function () {

                            if (collection.publishStartDate && collection.publishEndDate) {
                                var start = new Date(collection.publishStartDate);
                                var end = new Date(collection.publishEndDate);
                            } else {
                                var start = new Date(success.transaction.startDate);
                                var end = new Date(success.transaction.endDate);
                            }
                            return end - start;
                        })();

                        if (collection.publishStartDate) {
                            var starting = StringUtils.formatIsoFullSec(collection.publishStartDate);
                        } else {
                            var starting = StringUtils.formatIsoFullSec(success.transaction.startDate);
                        }

                        // var verifiedCount = collection.verifiedCount;
                        // var verifyFailedCount = collection.verifyFailedCount;
                        // var verifyInprogressCount = collection.verifyInprogressCount;
                        details = {
                            name: collection.name,
                            // verifiedCount: verifiedCount,
                            // verifyInprogressCount: verifyInprogressCount,
                            // verifyFailedCount: verifyFailedCount,
                            date: collection.formattedDate,
                            starting: starting,
                            duration: duration,
                            success: success,
                            datasets: datasets,
                            datasetVersions: datasetVersions,
                            events: events
                        };

                        var showPanelOptions = {
                            html: templates.reportPublishedDetails(details),
                            moveCenteredPanel: true
                        };

                        showPanel($this, showPanelOptions);
                        bindAccordions();
                        bindTableOrdering();

                    },
                    error: function (response) {
                        handleApiError(response);
                    }
                });

            } else {

                // Load details with unpublished data
                details = {
                    name: collection.name,
                    events: events
                };

                var showPanelOptions = {
                    html: templates.reportUnpublishedDetails(details),
                    moveCenteredPanel: true
                };
                showPanel($this, showPanelOptions);
            }

            bindAccordions();

            $('.btn-collection-cancel').click(function () {
                var hidePanelOptions = {
                    moveCenteredPanel: true
                };
                hidePanel(hidePanelOptions)
            });

        },
        error: function (response) {
            handleApiError(response);
        }
    });
}


function bindTableOrdering() {
    // Bind table ordering functionality to publish times
    var $publishTimeHeadings = $('.publish-times-table th');
    $publishTimeHeadings.click(function () {

        // Get table, reverse order and rebuild it
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc) {
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }

        /* TODO Get sorting arrows working - also code commented out in related SCSS */
        // Update active classes to show sort direction in UI
        $publishTimeHeadings.removeClass('active active--asc active--desc');
        var tableDirection = "asc";
        if (!this.asc) {
            tableDirection = "desc";
        }
        var activeClass = "active active--" + tableDirection;
        $(this).addClass(activeClass);
    });

    function comparer(index) {
        return function (a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index);
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
        }
    }

    function getCellValue(row, index) {
        return $(row).children('td').eq(index).html()
    }

}