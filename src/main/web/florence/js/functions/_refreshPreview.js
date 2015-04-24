function refreshPreview(url) {

  if(url) {
    url = $('#iframe')[0].contentWindow.document.location.href.split('#!')[0] + '#!' + url;
    console.log(url);
    $('#iframe')[0].contentWindow.document.location.href = url;
  }
  else {
    $('#iframe')[0].contentWindow.document.location.href = localStorage.getItem("pageurl");
  }

  $('#iframe')[0].contentWindow.document.location.reload(true);
}

