function getPathName() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;
  checkPathSlashes(parsedUrl);
  return parsedUrl;
}

