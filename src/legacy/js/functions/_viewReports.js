function viewReports() {

    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/publishedCollections`,
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
            url: `${API_PROXY.VERSIONED_PATH}/collections`,
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
