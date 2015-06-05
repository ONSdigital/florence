var Florence = Florence || {
    tredegarBaseUrl: window.location.origin + '/index.html#!',
    refreshAdminMenu: function () {
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    },
    setActiveCollection: function (collection) {
      document.cookie = "collection=" + collection.id + ";path=/";
      var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      Florence.collection = {id: collection.id, name: collection.name, date: formattedDate};
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.collection = {};

Florence.collectionToPublish = {};

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
        var browserLocation = document.getElementById('iframe').contentWindow.location.href;
        $('.browser-location').val(browserLocation);
        if ($('.workspace-edit').length) {
          loadPageDataIntoEditor(newUrl, Florence.collection.id);
        }
        else if ($('.workspace-browse').length) {
          treeNodeSelect(newUrl);
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
