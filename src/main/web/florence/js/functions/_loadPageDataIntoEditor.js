function loadPageDataIntoEditor(collectionName){

  var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  var dataUrl = "/data" + pageurl.split("#!")[1];

  $.ajax({
    url: dataUrl,
    dataType: 'json',
    crossDomain: true,

    success: function(response) {
      data = response;
      makeEditSections(collectionName, response);
    },

    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}


