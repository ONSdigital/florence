function loadCreateScreen(parentUrl, collectionId, type) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);
  loadCreator(parentUrl, collectionId, type);
}
