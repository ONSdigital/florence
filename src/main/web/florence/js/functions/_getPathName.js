function getPathName() {
  var parsedUrl = $('.fl-panel--preview__content').contents().get(0).location.href.split("#!")[1];

  if (parsedUrl === '/')
    parsedUrl = '';

  return parsedUrl;
}

