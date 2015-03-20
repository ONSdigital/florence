function setupPageLocation() {
  iframeUrl = localStorage.getItem("pageurl");
  nowUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
  if (iframeUrl !== nowUrl) {
    loadPageDataIntoEditor();
    localStorage.setItem("pageurl", nowUrl);
  }
}
