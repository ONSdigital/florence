function getPathName() {
//  var parsedUrl = $('#iframe')[0].contentWindow.location.href.split("#!")[1];
  var nowUrl = $('#iframe')[0].contentWindow.document.location.pathname;

  if (parsedUrl.charAt(0) === '/') {
    parsedUrl = parsedUrl.slice(1);
    return parsedUrl;
  }
}

