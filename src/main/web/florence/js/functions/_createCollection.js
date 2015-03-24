function createCollection() {
  var publishDay,publishMonth,publishYear,publishTime,collectionName;
  publishDay   = $('.fl-collection-publish-day').val();
  publishMonth = $('.fl-collection-publish-month').val();
  publishYear  = $('.fl-collection-publish-year').val();
  publishTime  = $('.fl-collection-publish-time').val();
  collectionName = $('.fl-collection-name-input').val();

  // months are zero indexed.
  var publishDate = new Date(2015, publishMonth - 1, publishDay, 9, 30, 0, 0);

    // Create the collection
    console.log(collectionName + " " + publishDate);
    $.ajax({
        url: "/zebedee/collection",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({name: collectionName, publishDate: publishDate}),
        headers:{ "X-Florence-Token":accessToken() },
        success: function () {
          console.log("Collection " + collectionName + " created" );
          viewController('collections');
        },
        error: function (jqxhr) {
          console.log('Error creating collection' + jqxhr.responseText);
        }
    });
}
