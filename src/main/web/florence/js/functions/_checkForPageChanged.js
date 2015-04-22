function checkForPageChanged() {

  var iframeUrl = localStorage.getItem("pageurl");
  var nowUrl = $('#iframe')[0].contentWindow.document.location.href.split("#!")[1];
  if (iframeUrl !== nowUrl) {
    localStorage.setItem("pageurl", nowUrl);
  }
}
