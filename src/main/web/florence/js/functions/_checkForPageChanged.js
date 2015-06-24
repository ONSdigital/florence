function checkForPageChanged(onChanged) {
  var iframeUrl = localStorage.getItem("pageurl");
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;
  if (iframeUrl !== nowUrl) {
    if (!onChanged) {
      localStorage.setItem("pageurl", nowUrl);
    } else {
      setTimeout(function () {
        localStorage.setItem("pageurl", nowUrl);
      }, 200);
      onChanged(nowUrl);
    }
  }
}

