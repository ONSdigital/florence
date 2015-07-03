function getPathName() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;

  if (parsedUrl.charAt(0) === '/') {
    parsedUrl = parsedUrl.slice(1);
  }
  return parsedUrl;
}

