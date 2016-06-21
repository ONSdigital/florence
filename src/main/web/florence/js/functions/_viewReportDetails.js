function viewReportDetails(collection, isPublished) {
    var details, reportDetails, published, events;

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

                        //console.log(collection);

                        var date = collection.publishEndDate;
                        collection.formattedDate = StringUtils.formatIsoFull(date);

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
                            success: success
                        };

                        reportDetails = templates.reportPublishedDetails(details);

                        $('.publish-selected').html(reportDetails);
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
                reportDetails = templates.reportUnpublishedDetails(details);
            }

            // Load handlebars into page and bind accordion events
            $('.publish-selected').html(reportDetails);
            bindAccordions();

            $('.publish-selected .btn-collection-cancel').click(function () {
                $('.publish-selected').animate({right: "-50%"}, 500);
                $('.publish-select').animate({marginLeft: "25%"}, 800);
                $('.publish-select-table tbody tr').removeClass('selected');
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