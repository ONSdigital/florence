function loadCreateScreen(collectionId) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);
  loadCreator(collectionId);
}
