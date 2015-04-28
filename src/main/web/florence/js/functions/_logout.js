function logout() {
  delete_cookie('access_token');
  localStorage.removeItem("loggedInAs");
  Florence.isAuthenticated = false;

  // refresh the navigation
  var mainNavHtml = templates.mainNav(Florence);
  $('#admin-menu').html(mainNavHtml);

  viewController();
}

function delete_cookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}