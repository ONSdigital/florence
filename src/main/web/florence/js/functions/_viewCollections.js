function viewCollections() {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (data) {
      populateCollectionTable(data);
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

  function populateCollectionTable(data) {

      $.each(data, function(i, collection) {

        var date = new Date(collection.publishDate);
        var minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();

        formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
      });

    $('.collections-select-table tbody tr').click(function(){
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.collection-selected').animate({right: "0%"}, 500);
      var collectionId = $(this).attr('data-id');
      viewCollectionDetails(collectionId);
    });


	//build view
  // template name: collections

	//click handlers
  $('.btn-collection-create').click(function() {
    createCollection();
  });
}


