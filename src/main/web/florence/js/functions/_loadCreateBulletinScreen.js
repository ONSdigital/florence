function loadCreateBulletinScreen(collectionName) {
  var html = templates.workCreate;
  $('.workspace-menu').html(html);
  loadT4Creator(collectionName);
}
