function refreshPreview(url) {

  if (url) {
    if (url.charAt(0) !== '/') {
      url = '/' + url;
    }
    url = Florence.tredegarBaseUrl + url;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
  else {
    var urlStored = localStorage.getItem("pageurl");
    if (urlStored.charAt(0) !== '/') {
      urlStored = '/' + urlStored;
    }
    var url = Florence.tredegarBaseUrl + urlStored;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
}

