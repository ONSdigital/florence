function viewReports() {

    $.ajax({
        url: "/zebedee/publishedcollections",
        type: "get",
        crossDomain: true,
        success: function (collections) {
            getUnpublishedCollections(collections);
        },
        error: function (response) {
            handleApiError(response);
        }
    });

    function getUnpublishedCollections(publishedCollections) {
        $.ajax({
            url: "/zebedee/collections",
            type: "GET",
            crossDomain: true,
            success: function(response) {
                var collections = [];
                collections["published"] = publishedCollections;
                collections["unpublished"] = response;
                populateTable(collections);
            },
            error: function (response) {
                handleApiError(response)
            }
        })
    }

    function populateTable(collections) {
        var collections = collections;

        // Build published collections objects
        var publishedCollections = _.chain(collections.published)
            .filter(function (collection) {
                return collection.publishResults && collection.publishResults.length > 0;
            })
            .value();

        $(publishedCollections).each(function (i) {
            publishedCollections[i].order = i;
        });

        $(publishedCollections).each(function (n, coll) {
            if (coll.publishResults && coll.publishResults.length > 0) {

                if (coll.publishStartDate) {
                    var date = coll.publishStartDate;
                } else {
                    var date = coll.publishResults[coll.publishResults.length - 1].transaction.startDate;
                }

                publishedCollections[n].formattedDate = StringUtils.formatIsoFull(date);
            }
        });

        collections["published"] = publishedCollections;

        var reportList = templates.reportList(collections);
        $('.section').html(reportList);

        // Bind click on unpublished collection
        $('.unpublished').click(function() {
            var i = $(this).attr('data-collections-order');
            viewReportDetails(collections.unpublished[i]);

            selectTr($(this));
        });

        // Bind click on published collection
        $('.published').click(function () {
            var i = $(this).attr('data-collections-order');
            viewReportDetails(collections.published[i]);

            selectTr($(this));
        });

        function selectTr($this) {
            $('.publish-select-table tbody tr').removeClass('selected');
            $this.addClass('selected');
            $('.publish-selected').animate({right: "0%"}, 800);
            $('.publish-select').animate({marginLeft: "0%"}, 500);
        }
    }
}
