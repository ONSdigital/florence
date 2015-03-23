function loadPageDataIntoEditor(collectionName){

  var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  var dataPath = pageurl.split("#!")[1];
  if (dataPath.charAt(dataPath.length -1) != "/") dataPath += "/"
  var dataUrl = "/zebedee/content/" + collectionName + "?uri=" + dataPath + "data.json"

  //console.log("Url to load data from: " + dataUrl);

  $.ajax({
    url: dataUrl,
    dataType: 'json',
    crossDomain: true,

    success: function(response) {
      data = response;
      makeEditSections(response);
    },

    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}


