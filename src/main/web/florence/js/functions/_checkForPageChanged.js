function checkForPageChanged(onChanged) {

  var iframeUrl = localStorage.getItem("pageurl");
  var nowUrl = $('#iframe')[0].contentWindow.document.location.href.split("#!")[1];
  if (iframeUrl !== nowUrl) {
    if (!onChanged) {
      localStorage.setItem("pageurl", nowUrl);
    } else {
      onChanged();
      localStorage.setItem("pageurl", nowUrl);
    }
  }
}
