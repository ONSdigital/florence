function checkForPageChanged(onChanged) {

  var iframeUrl = localStorage.getItem("pageurl");
  var nowUrl = $('#iframe')[0].contentWindow.document.location.href.split("#!")[1];
  if (iframeUrl !== nowUrl) {
    if (!onChanged) {
      return;
    } else {
      onChanged();
    }
    localStorage.setItem("pageurl", nowUrl);
  }
}
