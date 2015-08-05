function checkForPageChanged(onChanged) {
  //var iframeUrl = localStorage.getItem("pageurl");
  var iframeUrl = Florence.globalVars.pagePath;
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;
  if (iframeUrl !== nowUrl) {
    if (Florence.globalVars.pagePos) {
      Florence.globalVars.pagePos = false;
    }
    if (!onChanged) {
      Florence.globalVars.pagePath = nowUrl;
    } else {
      Florence.globalVars.pagePath = nowUrl;
      onChanged(nowUrl);
    }
  }
}

