function checkPathParsed (uri) {
  if (uri.charAt(uri.length-1) === '/') {
      uri = uri.slice(0, -1);
  }
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
  var myUrl = parseURL(uri);
  return myUrl.pathname;
}
