function createCollection() {
  var publishDay,publishMonth,publishYear,publishTime,collectionName
  //zebedee doesnt currently use the date
  publishDay   = $('.fl-collection-publish-day').val()
  publishMonth = $('.fl-collection-publish-month').val()
  publishYear  = $('.fl-collection-publish-year').val()
  publishTime  = $('.fl-collection-publish-time').val()
  collectionName = $('.fl-collection-name-input').val()
    // Create the collection
    console.log(collectionName)
    $.ajax({
        url: "http://localhost:8082/collection",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({name: collectionName}),
        success: function () {
          console.log("Collection " + collectionName + " created" );
        },
        error: function () {
          console.log('Error creating collection');
        }
    });
}
