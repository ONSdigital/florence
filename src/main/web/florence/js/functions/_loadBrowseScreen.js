function loadBrowseScreen(collectionId, click) {

  return $.ajax({
    url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
    dataType: 'json',
    type: 'GET',
    success: function (response) {
      var browserContent = $('#iframe')[0].contentWindow;
      //var baseURL = 'http://' + window.location.host + '/index.html#!';
      var baseURL = Florence.tredegarBaseUrl;
      var html = templates.workBrowse(response);
      $('.workspace-menu').html(html);
      $('.workspace-browse').css("overflow", "scroll");

      //page-list
      $('.page-item').click(function () {

        var uri = $(this).closest('li').attr('data-url');

        if(uri) {
          var newURL = baseURL + uri;

          $('.page-list li').removeClass('selected');
          $(this).parent('li').addClass('selected');

          $('.page-options').hide();
          $(this).next('.page-options').show();



          //change iframe location
          browserContent.location.href = newURL;
          $('.browser-location').val(newURL);
          checkForPageChanged();
        }

        //page-list-tree
        $('.tree-nav-holder ul').removeClass('active');
        $(this).parents('ul').addClass('active');
        $(this).closest('li').children('ul').addClass('active');
        
        if ($(this).hasClass('page-item--directory')) {
          $('.page-item--directory').removeClass('page-item--directory--selected');
          $(this).addClass('page-item--directory--selected');
        }

      });

      if (click) {
        treeNodeSelect(document.getElementById('iframe').contentWindow.location.href);
      } else {
        treeNodeSelect('/');
      }

      //$('.page-list--tree .page-item').click(function(){
      //  //change iframe location
      //  var newURL = baseURL + $(this).closest('li').attr('data-url');
      //  browserContent.location.href = newURL;
      //  $('.browser-location').val(newURL);
      //  checkForPageChanged();
      //});
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

