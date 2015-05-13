function createWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", currentPath);

  Florence.refreshAdminMenu();

  var workSpace = templates.workSpace(Florence.tredegarBaseUrl + path);
  $('.section').html(workSpace);

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
        loadBrowseScreen('click');
      } else if (menuItem.is('#create')) {
        loadCreateScreen(collectionName);
      } else if (menuItem.is('#edit')) {
        loadPageDataIntoEditor(getPathName(document.getElementById('iframe').contentWindow.location.href), Florence.collection.id);
      } else {
        loadBrowseScreen();
      }
    }

  document.getElementById('iframe').onload = function () {
    var browserLocation = document.getElementById('iframe').contentWindow.location.href;
    $('.browser-location').val(browserLocation);
    var iframeEvent = document.getElementById('iframe').contentWindow;
    iframeEvent.addEventListener('click', Florence.Handler, true);
  }

  //$('iframe').load(function() {
  //  var iframe = $('iframe');
  //  var browserLocation = iframe.contents().get(0).location.href;
  //  $('.browser-location').val(browserLocation);
  //  iframe.contents().on('click', Florence.Handler);
  //});

  viewWorkspace(path, collectionName, menu);
};



