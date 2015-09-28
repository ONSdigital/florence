function viewReports() {

  $.ajax({
    url: "/zebedee/publishedcollections",
    type: "get",
    crossDomain: true,
    success: function (collections) {

      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

  function populatePublishTable(collections) {

    var filteredCollections = _.chain(collections)
      .filter(function (collection) {
        return collection.publishResults && collection.publishResults.length > 0;
      })
      .value();

    $(filteredCollections).each(function (i) {
      filteredCollections[i].order = i;
    });

    $(filteredCollections).each(function (n, coll) {
      if(coll.publishResults && coll.publishResults.length > 0) {
        var date = coll.publishResults[coll.publishResults.length - 1].transaction.startDate;
        filteredCollections[n].formattedDate = StringUtils.formatIsoFull(date);
      }
    });

    var reportList = templates.reportList(filteredCollections);
    $('.section').html(reportList);

    $('.publish-select-table tbody tr').click(function () {
      var i = $(this).attr('data-collections-order');
      viewReportDetails(filteredCollections[i]);

      $('.publish-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.publish-selected').animate({right: "0%"}, 800);
      $('.publish-select').animate({marginLeft: "0%"}, 500);
    });
  }
}
