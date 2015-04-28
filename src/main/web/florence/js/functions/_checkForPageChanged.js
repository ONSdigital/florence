function checkForPageChanged(onChanged) {
  var iframeUrl = localStorage.getItem("pageurl");
  console.log(iframeUrl)
  var nowUrl = $('#iframe')[0].contentWindow.document.location.href.split("#!")[1];
  console.log(nowUrl)
  if (iframeUrl !== nowUrl) {
    if (!onChanged) {
      localStorage.setItem("pageurl", nowUrl);
    } else {
      setTimeout(function () {
        localStorage.setItem("pageurl", nowUrl);
      }, 200);
      onChanged();
    }
  }
}

