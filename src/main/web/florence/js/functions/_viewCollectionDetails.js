function viewCollectionDetails(collectionName) {

  $.ajax({
    url: "/zebedee/collection/" + collectionName,
    type: "get",
    headers:{ "X-Florence-Token":accessToken() },
    crossDomain: true
  }).done(function (data) {

    var collection_summary =
      '<h1>' + data.name + '</h1>' +
      '<p>' + data.inProgressUris.length + ' Pages in progress</p>' +
      '<p>' + data.completeUris.length + ' Pages awaiting review</p>' +
      '<p>' + data.reviewedUris.length + ' Pages awaiting approval</p>';

    $('.fl-panel--collection-details-container').html(collection_summary);
  });

  $('.fl-work-on-collection-button').click(function () {
    document.cookie = "collection=" + collectionName + ";path=/";
    localStorage.setItem("collection", collectionName);
    viewController('workspace');
  });

  $('.fl-button--cancel').click(function () {
    //perhaps need to rethink this if we do decide to animate panel transitions within this view
    viewController('collections');
  });
}
