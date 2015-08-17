function getParentPage (url) {
  var checkedUrl = checkPathSlashes(url);
  var contentUrlTmp = checkedUrl.split('/');
  contentUrlTmp.splice(-1, 1);
  var contentUrl = contentUrlTmp.join('/');
  return contentUrl;
}
