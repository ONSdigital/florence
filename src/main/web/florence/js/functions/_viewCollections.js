function viewCollections() {

  var select_collections = '<section class="fl-panel fl-panel--collections fl-panel--collections__not-selected">' +
    '<h1>Select a collection</h1>' +
    '<div class="fl-collections-holder"></div>' +
    '<button class="fl-button fl-button--big fl-button--center fl-create-collection-button">Create a collection</button>' +
    '</section>';

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (data) {
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

  function populateCollectionTable(data) {

      $.each(data, function(i, collection) {

        var date = new Date(collection.publishDate);
        var minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();

        $('tbody',page).append(
            '<tr class="fl-collections-table-row" data-id="' + collection.id + '">' +
            '  <td class= "collection-name">' + collection.name + '</td>' +
            '  <td>' + $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes + '</td>' +
            '</tr>'
          );

        makeCollectionView(collection.id,data);
      });

      $('.fl-collections-table-row').click(function() {
        //console.log('Collection row clicked for id: ' + $(this).attr('data-id'));
        var collectionId = $(this).attr('data-id');

        if(collectionId) {
          $('.fl-panel--collections').removeClass('fl-panel--collections__not-selected');
          $('.fl-panel--collection-details').show();
          $('.fl-create-collection-button').hide();

					$('.fl-collections-table-row').removeClass('fl-panel--collections__selected');
          $(this).addClass('fl-panel--collections__selected');

          viewCollectionDetails(collectionId);
        }
      });
    }

	//build view
  // template name: collections

	//click handlers
  $('.btn-collection-create').click(function() {
    createCollection();
  });
}


