function checkPathParsed (uri) {
  if (uri.charAt(0) !== '/') {
    uri = '/' + uri;
  }
  var myUrl = parseURL(uri);
  var safeUrl = myUrl.pathname;
  if (safeUrl.charAt(safeUrl.length-1) === '/') {
    safeUrl = safeUrl.slice(0, -1);
  }
  return safeUrl;
}
