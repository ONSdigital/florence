function checkForPageChanged(onChanged) {

  iframeUrl = localStorage.getItem("pageurl");
  nowUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
  if (iframeUrl !== nowUrl) {
    onChanged();
    localStorage.setItem("pageurl", nowUrl);
  }
}
