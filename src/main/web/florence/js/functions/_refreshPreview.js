function refreshPreview(url) {
  var url;
  if (url.charAt(0) === '/') {
    url = url.slice(1,- 1);
  }
  if(url) {
    url = Florence.tredegarBaseUrl + "/" + url;
    $('#iframe')[0].contentWindow.document.location.href = url;
    console.log($('#iframe')[0].contentWindow.document.location.href = url)
  }
  else {
//    $('#iframe')[0].contentWindow.document.location.href = localStorage.getItem("pageurl");
//    $('#iframe')[0].contentWindow.document.location.reload(true);
  }
//    setTimeout(function () {
//      $('#iframe')[0].contentWindow.document.location.reload(true);
//    }, 500);

}

