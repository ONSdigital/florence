function refreshPreview(url) {

  if (url) {
    checkPathSlashes(url);
    url = Florence.tredegarBaseUrl + url;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
  else {
    //var urlStored = localStorage.getItem("pageurl");
    var urlStored = Florence.globalVars.pagePath;
    checkPathSlashes(urlStored);
    var url = Florence.tredegarBaseUrl + urlStored;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
}

