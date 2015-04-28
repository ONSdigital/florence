function checkIframe() {
  var browserContent = document.getElementById('iframe').contentWindow;
  browserContent.addEventListener('click', function iClick() {
    setTimeout(function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      checkForPageChanged();
      console.log('iframe inner clicked');
    }, 200);
    $('.browser-location').val($('#iframe').attr('src'));
  }, false);
}

