function loadCreateScreen(parentUrl, collectionId) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);
  loadCreator(parentUrl, collectionId);
}
