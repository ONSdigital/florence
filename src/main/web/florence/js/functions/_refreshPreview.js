function refreshPreview(url) {

  if (url) {
    if (url.charAt(0) === '/') {
      url = url.slice(1);
    }
    url = Florence.tredegarBaseUrl + "/" + url;
    document.getElementById('iframe').contentWindow.location.href = url;
  }
  else {
    var url = Florence.tredegarBaseUrl + "/" + localStorage.getItem("pageurl");
    document.getElementById('iframe').contentWindow.location.href = url;
  }
}

