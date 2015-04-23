function setupMiniBrowser() {
  var browserContent = $('#iframe')[0].contentWindow;
  $(browserContent.document).on('click', function(){
    var browserLocation = browserContent.location.href;
    $('.browser-location').val(browserLocation);
    treeNodeSelect(browserLocation);
    checkForPageChanged();
    //console.log(browserLocation);
    // console.log('iframe inner clicked');
  });
  $('.browser-location').val($('#iframe').attr('src'));
}
