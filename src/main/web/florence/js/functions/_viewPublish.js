function viewPublish() {

  var select_publish = '<section class="fl-panel fl-panel--publish fl-panel--collections fl-panel--collections__not-selected">' +
    '<h1>Select a publish</h1>' +
    '<div class="fl-publish-table-holder"></div>' +
    '</section>';

  $.ajax({
    url: "/zebedee/collections",
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
    var table_holder = $('.fl-publish-table-holder');

    var publish_table =
      '<table class="fl-publish-table">' +
      '<tbody>' +
      '<tr>' +
      '<th>Publish date</th>' +
      '</tr>';

    $(table_holder).html(publish_table);

    var collectionsByDate = _.chain(collections)
      .filter( function(collection) { return collection.approvedStatus })
      .sortBy('publishDate')
      .groupBy('publishDate')
      .value();

    $.each(_.keys(collectionsByDate), function (i, date) {

      var collectionsJson = JSON.stringify(collectionsByDate[date]);
      var date = new Date(date);
      var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

      $('tbody', table_holder).append(
        '<tr class="fl-collections-table-row" data-collections="' + htmlEscape(collectionsJson) + '">' +
        '<td>' + $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes + '</td>' +
        '</tr>'
      );
    });

    table_holder.append(
      '</tbody>' +
      '</table>');

    $('.fl-collections-table-row').click(function () {

      var collections = JSON.parse($(this).attr('data-collections'));
      if (collections) {

        $('.fl-panel--collections').removeClass('fl-panel--collections__not-selected');
        $('.fl-panel--collection-details').show();
        $('.fl-create-collection-button').hide();
        //
        $('.fl-collections-table-row').removeClass('fl-panel--collections__selected');
        $(this).addClass('fl-panel--collections__selected');

        viewPublishDetails(collections);
      }
    });
  }

  function viewPublishDetails(collections) {

    var collection_list = '<div id="collection-accordion">';

    $.each(collections, function (i, collection) {
      collection_list +=
        '<h2 id="fl-panel--publish-collection-' + collection.id + '"  class="fl-panel--publish-collection" data-id="' + collection.id + '">' + collection.name + '</h2>' +
        '<div class="fl-panel--publish-collection-' + collection.id + '"></div>';
    });

    $('.fl-panel--collection-details-container').html(collection_list);
    $( "#collection-accordion" ).accordion({
      heightStyle: "content",
      active: false,
      collapsible: true
    });

    $('.fl-panel--publish-collection').click(function () {

      var collectionId = $(this).attr('data-id');

      getCollection(collectionId,
        success = function (response) {
          var page_list = '';
          var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

          $.each(response.reviewedUris, function (i, uri) {
            pageDataRequests.push(getPageData(collectionId, uri,
              success = function (response) {
                var path = uri.replace('/data.json', '');
                path = path.length === 0 ? '/' : path;
                page_list += '<p class="fl-review-page-list-item" data-path="' + path + '">' +
                response.name + '</p>';

                console.log(response.name);
              },
              error = function (response) {
                handleApiError(response);
              }));
          });

          $.when.apply($, pageDataRequests).then(function () {
            page_list += '</ul>';
            $('.fl-panel--publish-collection-' + collectionId).html(page_list);
            //updateReviewScreenWithCollection(response);

          });

        },
        error = function (response) {
          handleApiError(response);
        });
    });
  }

  var selected_publish =
    '<section class="fl-panel fl-panel--collection-details">' +
    '<div class="fl-panel--collection-details-container"></div>' +
    '<button class="fl-button fl-button--cancel">Cancel</button>' +
    '</section>';

//build view
  $('.fl-view').html(select_publish + selected_publish);

  $('.fl-button--cancel').click(function () {
    viewController('publish');
  });

  function htmlEscape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}


