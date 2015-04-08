function checkForPageChanged(onChanged) {

  var iframe = $('.fl-panel--preview__content').contents().get(0);

  if(iframe) {
    var iframeUrl = localStorage.getItem("pageurl");
    var nowUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
    if (iframeUrl !== nowUrl) {
      onChanged();
      localStorage.setItem("pageurl", nowUrl);
    }
  }
}
