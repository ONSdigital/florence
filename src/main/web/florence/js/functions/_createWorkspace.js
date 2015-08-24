function createWorkspace(path, collectionId, menu, stopEventListener) {
  var safePath = '';
  $("#working-on").on('click', function () {}); // add event listener to mainNav

  if(stopEventListener) {
    document.getElementById('iframe').onload = function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      var iframeEvent = document.getElementById('iframe').contentWindow;
          iframeEvent.removeEventListener('click', Florence.Handler, true);
    };
    return false;
  } else {
    var currentPath = '';
    if (path) {
      currentPath = path;
      safePath = checkPathSlashes(currentPath);
    }

    Florence.globalVars.pagePath = safePath;
    if (Florence.globalVars.welsh !== true) {
      document.cookie = "lang=" + "en;path=/";
    } else {
      document.cookie = "lang=" + "cy;path=/";
    }
    Florence.refreshAdminMenu();

    var workSpace = templates.workSpace(Florence.tredegarBaseUrl + safePath);
     $('.section').html(workSpace);

    document.getElementById('iframe').onload = function () {
      $('.browser-location').val(Florence.tredegarBaseUrl + Florence.globalVars.pagePath);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Florence.Handler, true);

      if (Florence.globalVars.welsh !== true) {
        $('#nav--workspace__welsh').empty().append('<a href="#">Language: English</a>');
      } else {
        $('#nav--workspace__welsh').empty().append('<a href="#">Language: Welsh</a>');
      }

      //click handlers
      $('.nav--workspace > li').click(function () {
        menu = '';
        if (Florence.Editor.isDirty) {
          var result = confirm("You have unsaved changes. Are you sure you want to continue");
          if (result === true) {
            Florence.Editor.isDirty = false;
            processMenuClick(this);
          } else {
            return false;
          }
        } else {
          processMenuClick(this);
        }

      });

      function processMenuClick(clicked) {
        var menuItem = $(clicked);

        $('.nav--workspace li').removeClass('selected');
        menuItem.addClass('selected');

        if (menuItem.is('#browse')) {
          loadBrowseScreen(collectionId, 'click');
        } else if (menuItem.is('#create')) {
          loadCreateScreen(Florence.globalVars.pagePath, collectionId);
        } else if (menuItem.is('#edit')) {
          loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
        } else {
          loadBrowseScreen(collectionId);
        }
      }

      $('#nav--workspace__welsh').on('click', function () {
        Florence.globalVars.welsh = Florence.globalVars.welsh === false ? true : false;
        createWorkspace(Florence.globalVars.pagePath, collectionId, 'browse');
      });

      $('.workspace-menu').on('click', '.btn-browse-create', function () {
        var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
        $('.nav--workspace li').removeClass('selected');
        $("#create").addClass('selected');
        loadCreateScreen(Florence.globalVars.pagePath, collectionId);
      });

      $('.workspace-menu').on('click', '.btn-browse-edit', function () {
        var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
        $('.nav--workspace li').removeClass('selected');
        $("#edit").addClass('selected');
        loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
      });

      //browse screen
      $('.nav--workspace li').removeClass('selected');
      $("#browse").addClass('selected');
      loadBrowseScreen(collectionId, 'click');
    }
  }
}



