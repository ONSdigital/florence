function setupMiniBrowser() {
  var browserContent = document.getElementById('iframe').contentWindow;
  browserContent.addEventListener('click', function iClick () {
    setTimeout(function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      treeNodeSelect(browserLocation);
      checkForPageChanged();
      //console.log('iframe inner clicked');
    }, 200);
    $('.browser-location').val($('#iframe').attr('src'));
  }, true);
}

function removeListen() {
  document.getElementById('iframe').contentWindow.removeEventListener('click', function iClick () {
    setTimeout(function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      treeNodeSelect(browserLocation);
      checkForPageChanged();
      //console.log('iframe inner clicked');
    }, 200);
    $('.browser-location').val($('#iframe').attr('src'));
  });
}




