function refreshPreview(url) {

  if (url) {
    var safeUrl = checkPathSlashes(url);
    var newUrl = Florence.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = newUrl;
    $('.browser-location').val(newUrl);
  }
  else {
    var urlStored = Florence.globalVars.pagePath;
    var safeUrl = checkPathSlashes(urlStored);
    var newUrl = Florence.tredegarBaseUrl + safeUrl;
    document.getElementById('iframe').contentWindow.location.href = newUrl;
    $('.browser-location').val(newUrl);
  }
}

