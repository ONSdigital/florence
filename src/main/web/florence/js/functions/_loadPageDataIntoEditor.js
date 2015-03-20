function loadPageDataIntoEditor(){

  var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  var pageurldata = "/data" + pageurl.split("#!")[1];

  loadData();

  function loadData() {
    $.ajax({
      url: pageurldata,
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

  function makeEditSections(response){
    if (response.type === 'bulletin'){
      bulletinEditor(response);
    } else {
      $('.fl-editor__sections').hide();
      $("#addSection").remove();
      $('.fl-editor__headline').show();
      $('.fl-editor__headline').val(JSON.stringify(response, null, 2));
      $('.fl-panel--editor__nav__save').click(function() {
        pageData = $('.fl-editor__headline').val();
        save("testCollection", pageData);
      });
    }
  }
}


