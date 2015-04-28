function createCollection() {
  var publishDay,publishMonth,publishYear,publishTime,collectionName;
  publishDay   = $('#day').val();
  publishMonth = $('#month').val();
  publishYear  = $('#year').val();
  publishTime  = $('#time').val();
  collectionName = $('#collectionname').val();
  
  var publishDate = new Date(publishYear, publishMonth, publishDay, 9, 30, 0, 0);

  // Create the collection
  $.ajax({
    url: "/zebedee/collection",
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify({name: collectionName, publishDate: publishDate}),
    success: function (response) {
      console.log("Collection " + response.name + " created");
      document.cookie = "collection=" + response.id + ";path=/";
      //localStorage.setItem("collection", collectionName);
      viewWorkspace('', response.id, 'browse');
    },
    error: function (response) {
      if(response.status === 409) {
        alert('A collection already exists with the name ' + collectionName);
      }
      else {
        handleApiError(response);
      }
    }
  });
}
