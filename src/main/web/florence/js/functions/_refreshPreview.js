function refreshPreview(url) {

  if(url) {
    url = $('.fl-panel--preview__content').get(0).src.split('#!')[0] + '#!' + url;
    console.log(url);
    $('.fl-panel--preview__content').get(0).src = url;
  }
  else {
    $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
  }

  $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);
}