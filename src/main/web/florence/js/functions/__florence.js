var Florence = Florence || {
    isAuthenticated: false,
    refreshAdminMenu: function () {
      var mainNavHtml = templates.mainNav(Florence);
      $('.admin-nav').html(mainNavHtml);
    }
  };

Florence.Editor = {
  isDirty: false,
  data: {}
};

Florence.collection = {};

