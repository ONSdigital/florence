function makeEditSections(response){
  if (response.type === 'bulletin'){
      bulletinEditor(response);
    }
  else {
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
