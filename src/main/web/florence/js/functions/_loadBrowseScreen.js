function loadBrowseScreen(click) {

  return $.ajax({
    url: "/navigation",
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
        $('.page-list li').removeClass('selected');
        $('.page-options').hide();

        $(this).parent('li').addClass('selected');
        $(this).next('.page-options').show();

        //page-list-tree
        $('.tree-nav-holder ul').removeClass('active');
        $(this).parents('ul').addClass('active');
        $(this).closest('li').children('ul').addClass('active');

        $('.btn-browse-edit').click(function () {
          var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
          viewWorkspace(dest, Florence.collection.id, 'edit');
          });
        $('.btn-browse-create').click(function () {
          var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
          viewWorkspace(dest, Florence.collection.id, 'create');
        });
//        $('.btn-browse-delete').click(function () {
//          var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
//
//        });
      });

      if (click) {
        treeNodeSelect(document.getElementById('iframe').contentWindow.location.href);
      }

      //page-list--tree
      $('.page-list--tree .page-item').click(function(){
        //change iframe location
        var newURL = baseURL + $(this).closest('li').attr('data-url');
        browserContent.location.href = newURL;
        $('.browser-location').val(newURL);
        checkForPageChanged();
      });
//      setupIframeHandler();
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

