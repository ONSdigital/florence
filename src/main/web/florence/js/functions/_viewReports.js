function viewReports() {

    $.ajax({
        url: "/zebedee/publishedCollections",
        type: "GET",
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
        //console.log(collections);

        // Build published collections objects
        // // var publishedCollections = _.chain(collections.published)
        // //     .filter(function (collection) {
        // //         return collection.publishResults && collection.publishResults.length > 0;
        // //     })
        // //     .value();
        //
        //
        // console.log(publishedCollections);
        // $(publishedCollections).each(function (n, coll) {
        //     var date = publishedCollections[n].
        //     if (coll.publishResults && coll.publishResults.length > 0) {
        //
        //         if (coll.publishStartDate) {
        //             var date = coll.publishStartDate;
        //         } else {
        //             var date = coll.publishResults[coll.publishResults.length - 1].transaction.startDate;
        //         }
        //
        //         publishedCollections[n].formattedDate = StringUtils.formatIsoFull(date);
        //     }
        // });
        //
        // collections["published"] = publishedCollections;

        var publishedCollections = collections.published;

        $(publishedCollections).each(function (i) {
            publishedCollections[i].order = i;
        });

        // Format the publishDate to user readable and add into JSON
        $(publishedCollections).each(function (i) {
            var formattedDate = collections["published"][i].publishDate;
            collections["published"][i].formattedDate = StringUtils.formatIsoFull(formattedDate);
        });

        // Pass data to template 
        var reportList = templates.reportList(collections);
        $('.section').html(reportList);

        // Bind click on unpublished collection
        $('.unpublished').click(function() {
            var i = $(this).attr('data-collections-order');
            var isPublished = false;
            viewReportDetails(collections.unpublished[i], isPublished, $(this));

            selectTr($(this));
        });

        // Bind click on published collection
        $('.published').click(function () {
            var i = $(this).attr('data-collections-order');
            var isPublished = true;
            viewReportDetails(collections.published[i], isPublished, $(this));

            selectTr($(this));
        });

        function selectTr($this) {
            // $('.publish-select-table tbody tr').removeClass('selected');
            // $this.addClass('selected');
            // $('.publish-selected').animate({right: "0%"}, 800);
            // $('.publish-select').animate({marginLeft: "0%"}, 500);
            var showPanelOptions = {

            }
        }
    }
}
