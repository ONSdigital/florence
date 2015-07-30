function checkPathParsed (uri) {
  if (uri.charAt(0) !== '/') {
    uri = '/' + uri;
  }
  var safeUrl;
  var myUrl = parseURL(uri);
  if (myUrl.pathname.charAt(myUrl.pathname.length-1) === '/') {
    myUrl.pathname = myUrl.pathname.slice(0, -1);
    safeUrl = myUrl.pathname;
  }
  return safeUrl;
}
