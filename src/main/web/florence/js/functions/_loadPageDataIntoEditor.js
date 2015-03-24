function loadPageDataIntoEditor(collectionName){

  var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  var pageurldata = "/data" + pageurl.split("#!")[1];

  $.ajax({
    url: pageurldata,
    dataType: 'json',
    crossDomain: true,
    success: function(response) {
      makeEditSections(collectionName, response);
    },
    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}


