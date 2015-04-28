function checkIframe() {
  var browserContent = document.getElementById('iframe').contentWindow;
  browserContent.addEventListener('click', function iClick () {
    setTimeout(function () {
      checkForPageChanged();
      console.log('iframe inner clicked');
    }, 200);
    $('.browser-location').val($('#iframe').attr('src'));
  }, true);
}


