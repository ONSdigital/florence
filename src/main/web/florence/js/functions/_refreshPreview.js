function refreshPreview(url) {

  if (url) {
    var safeUrl = checkPathSlashes(url);
    url = Florence.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
  else {
    //var urlStored = localStorage.getItem("pageurl");
    var urlStored = Florence.globalVars.pagePath;
    var safeUrl = checkPathSlashes(urlStored);
    var url = Florence.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
}

