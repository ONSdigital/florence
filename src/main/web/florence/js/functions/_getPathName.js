function getPathName() {
  var parsedUrl = $('#iframe')[0].contentWindow.location.href.split("#!")[1];

  if (parsedUrl === '/')
    parsedUrl = '';
  //console.log(parsedUrl);
  return parsedUrl;
}

