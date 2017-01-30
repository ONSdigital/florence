function getPreviewUrl() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;
  var safeUrl = checkPathSlashes(parsedUrl);
  return safeUrl;
}

