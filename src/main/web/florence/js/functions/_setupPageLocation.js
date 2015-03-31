function setupPageLocation() {

  iframeUrl = localStorage.getItem("pageurl");
  var collectionName = localStorage.getItem("collection");
  nowUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
  if (iframeUrl !== nowUrl) {
    loadPageDataIntoEditor(collectionName);
    localStorage.setItem("pageurl", nowUrl);
  }
}
