function getPathNameTrimLast() {
  var parsedUrl = document.getElementById('iframe').contentWindow.location.pathname;

  if (parsedUrl.charAt(parsedUrl.length-1) === '/') {
    parsedUrl = parsedUrl.slice(0, -1);
  }
  return parsedUrl;
}

