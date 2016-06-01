function viewReportDetails(collection) {
    var details, reportDetails, published;

    // Detect if we're loading a published collection
    if (collection.publishEndDate || collection.publishStartDate || collection.publishResults) {
        published = true;
    }


    if (published) {
        // Load details with published data

        if (!collection.publishResults || collection.publishResults.length === 0) {
            return;
        }

        var success = collection.publishResults[collection.publishResults.length - 1];
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

        var verifiedCount = collection.verifiedCount;
        var verifyFailedCount = collection.verifyFailedCount;
        var verifyInprogressCount = collection.verifyInprogressCount;
        details = {
            name: collection.name,
            verifiedCount: verifiedCount,
            verifyInprogressCount: verifyInprogressCount,
            verifyFailedCount: verifyFailedCount,
            date: collection.formattedDate,
            starting: starting,
            duration: duration,
            success: success
        };

        reportDetails = templates.reportPublishedDetails(details);
    } else {
        // Load details with unpublished data

        details = {
            name: collection.name
        };
        reportDetails = templates.reportUnpublishedDetails(details);
    }

    // Load handlebars into page and bind accordion events
    $('.publish-selected').html(reportDetails);
    bindAccordions();

    // TODO fix the table ordering
    // Bind table ordering functionality to publish times
    if (published) {
        $('.publish-times-table th').click(function () {
            var table = $(this).parents('table').eq(0);
            var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
            this.asc = !this.asc;
            if (!this.asc) {
                rows = rows.reverse();
            }
            for (var i = 0; i < rows.length; i++) {
                table.append(rows[i]);
            }
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

    $('.publish-selected .btn-collection-cancel').click(function () {
        $('.publish-selected').animate({right: "-50%"}, 500);
        $('.publish-select').animate({marginLeft: "25%"}, 800);
        $('.publish-select-table tbody tr').removeClass('selected');
    });
}

