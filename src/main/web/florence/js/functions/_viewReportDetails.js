function viewReportDetails(collection) {

  var success = collection.publishResults[collection.publishResults.length - 1];
  console.log(success);
  var duration = (function () {
    var start = new Date(success.transaction.startDate);
    var end = new Date(success.transaction.endDate);
    return end - start;
  })();
  var details = {name: collection.name, date: collection.formattedDate, duration: duration, success: success}

  var reportDetails = templates.reportDetails(details);
  $('.publish-selected').html(reportDetails);
  $('.collections-accordion').accordion({
    header: '.collections-section__head',
    heightStyle: "content",
    active: false,
    collapsible: true
  });

  $('.publish-selected .btn-collection-cancel').click(function () {
    $('.publish-selected').animate({right: "-50%"}, 500);
    $('.publish-select').animate({marginLeft: "25%"}, 800);
    $('.publish-select-table tbody tr').removeClass('selected');
  });
}

