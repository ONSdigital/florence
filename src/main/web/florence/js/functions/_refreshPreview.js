function refreshPreview(url) {
  var url;
  if (url.charAt(0) === '/') {
    url = url.slice(1);
  }
  if(url) {
    url = Florence.tredegarBaseUrl + "/" + url;
    document.getElementById('iframe').contentWindow.location.href = url;
    console.log(document.getElementById('iframe').contentWindow.location.href)
  }
  else {
    url = Florence.tredegarBaseUrl + "/" + localStorage.getItem("pageurl");
    document.getElementById('iframe').contentWindow.location.href = url;
  }
// reload here is redundant
//  document.getElementById('iframe').contentWindow.location.reload(true);

}

