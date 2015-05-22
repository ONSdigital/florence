function loadCreateScreen(collectionId) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);

  // Default
  pageType = "bulletin";

  $('select').change(function () {
    pageType = $(this).val();
  });

  if (pageType === 'bulletin' || 'article' || 'dataset' || 'methodology') {
    loadT4Creator(collectionId, pageType);
  }
  else if (pageType === 'static' || 'qmi' || 'foi' || 'adHoc') {
    loadT7Creator(collectionId, pageType);
  }
}
