function viewReports() {
  var manual = '[manual collection]';

  $.ajax({
    url: "/zebedee/publishedcollections",
    type: "get",
    crossDomain: true,
    success: function (collections) {
      $(collections).each(function (i) {
        collections[i].order = i;
      });
      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

  function populatePublishTable(collections) {

    //var collectionsByDate = _.chain(collections)
    //  .filter(function (collection) {
    //    return collection.publishResults[collection.publishResults.length - 1].transaction.startDate;
    //  })
    //  .sortBy('startDate')
    //  .value();

    //$(collectionsByDate).each(function (n, coll) {
    $(collections).each(function (n, coll) {
      if(coll.publishResults && coll.publishResults.length > 0) {
        var date = coll.publishResults[coll.publishResults.length - 1].transaction.startDate;

        //collectionsByDate[n].formattedDate = StringUtils.formatIsoFull(date);
        collections[n].formattedDate = StringUtils.formatIsoFull(date);
      }
    });

    //var reportList = templates.reportList(collectionsByDate);
    var reportList = templates.reportList(collections);
    $('.section').html(reportList);

    $('.publish-select-table tbody tr').click(function () {
      var i = $(this).attr('data-collections-order');
      viewReportDetails(collections[i]);

      $('.publish-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.publish-selected').animate({right: "0%"}, 800);
      $('.publish-select').animate({marginLeft: "0%"}, 500);
    });
  }
}
