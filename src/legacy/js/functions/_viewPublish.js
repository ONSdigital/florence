function viewPublish() {
    var manual = '[manual collection]';

    $.ajax({
        url: "/zebedee/collections",
        type: "get",
        crossDomain: true,
        success: function (collections) {
            $(collections).each(function (i) {
                if (!collections[i].type || (collections[i].type === 'manual')) {
                    collections[i].publishDate = manual;
                }
            });
            populatePublishTable(collections);
        },
        error: function (response) {
            handleApiError(response);
        }
    });

    var result = [];

    function populatePublishTable(collections) {


        var collectionsByDate = _.chain(collections)
            .filter(function (collection) {
                return collection.approvalStatus == "COMPLETE"
            })
            .sortBy('publishDate')
            .groupBy('publishDate')
            .value();

        for (var key in collectionsByDate) {
            if (key === manual) {
                var formattedDate = manual;
            } else {
                var formattedDate = StringUtils.formatIsoFull(key);
            } 
            result.push({date: key, formattedDate: formattedDate});
        }

        var publishList = templates.publishList(result);
        $('.section').html(publishList);

        $('.js-selectable-table tbody tr').click(function () {
            var date = $(this).attr('data-publish-date');
            Florence.collectionToPublish.publishDate = $(this).find('td').html();
            viewPublishDetails(collectionsByDate[date]);

            var showPanelOptions = {
                html: false,
                moveCenteredPanel: true
            };
            showPanel($(this), showPanelOptions);
        });
    }
}

