function refreshPreview(url) {

  if(url) {
    //var baseUrl = 'http://localhost:8081/index.html#!';
    var baseURL = 'http://' + window.location.host + '/index.html#!';
    url = baseUrl + url;
    $('#iframe')[0].contentWindow.document.location.href = url;
  }
  else {
    $('#iframe')[0].contentWindow.document.location.href = localStorage.getItem("pageurl");
  }

  $('#iframe')[0].contentWindow.document.location.reload(true);
}

