function logout() {
  delete_cookie('access_token');
  localStorage.removeItem("loggedInAs");
  Florence.refreshAdminMenu();
  viewController();
}

function delete_cookie(name) {
  document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}