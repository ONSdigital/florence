var Florence = Florence || {
    tredegarBaseUrl: window.location.origin,
    refreshAdminMenu: function () {
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    },
    setActiveCollection: function (collection) {
      document.cookie = "collection=" + collection.id + ";path=/";
      if (!collection.publishDate) {
        var formattedDate = null;
      } else {
        var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      }
      Florence.collection = {id: collection.id, name: collection.name, date: formattedDate};
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.collection = {};

Florence.collectionToPublish = {};

Florence.globalVars = {pagePath: '', activeTab: false, pagePos: ''};

Florence.Authentication = {
  accessToken: function () {
    return CookieUtils.getCookieValue("access_token");
  },
  isAuthenticated: function () {
    return Florence.Authentication.accessToken() !== ''
  }
};

Florence.Handler = function () {
  if (Florence.Editor.isDirty) {
    var result = confirm("You have unsaved changes. Are you sure you want to continue");
    if (result === true) {
      Florence.Editor.isDirty = false;
      processPreviewClick(this);
      return true;
    } else {
      return false;
    }
  } else {
    processPreviewClick(this);
  }

  function processPreviewClick() {
    setTimeout(function () {
      checkForPageChanged(function (newUrl) {
        var safeUrl = checkPathSlashes(newUrl);
        var browserLocation = document.getElementById('iframe').contentWindow.location.href;
        $('.browser-location').val(browserLocation);
        if ($('.workspace-edit').length) {
          loadPageDataIntoEditor(safeUrl, Florence.collection.id);
        }
        else if ($('.workspace-browse').length) {
          treeNodeSelect(safeUrl);
        }
      });
    }, 200);

    console.log('iframe inner clicked');
  }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
  module.exports = Florence;
}


