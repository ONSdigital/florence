function refreshPreview(url) {

  if(url) {
    url = Florence.tredegarBaseUrl + "/" + url;
    $('#iframe')[0].contentWindow.document.location.href = url;
  }
  else {
    $('#iframe')[0].contentWindow.document.location.href = localStorage.getItem("pageurl");
  }

  $('#iframe')[0].contentWindow.document.location.reload(true);
}

