function checkPathSlashes (uri) {
  //if (uri.charAt(uri.length - 1) === '/') {
  //  uri = uri.slice(0, -1);
  //  console.debug('removed slash at the end here!');
  //}
  var checkedUri = uri[uri.length - 1] === '/' ? uri.substring(0, uri.length - 1) : uri;
  checkedUri = checkedUri[0] !== '/' ? '/' + checkedUri : checkedUri;
  //if (uri.charAt(0) !== '/') {
  //  uri = '/' + uri;
  //}
  //return uri;
  console.log(checkedUri);
  return checkedUri;
}

