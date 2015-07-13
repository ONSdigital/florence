function checkRelatedPath (uri) {
  if (uri.charAt(uri.length-1) === '/') {
      uri = uri.slice(0, -1);
    }
  var myUrl = parseURL(uri);
  return myUrl.pathname;
}
