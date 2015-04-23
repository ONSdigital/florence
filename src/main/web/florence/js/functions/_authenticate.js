function authenticate(email,password) {
	//

  $.ajax({
    url: "/zebedee/login",
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    data: JSON.stringify({
      email: email,
      password: password
    }),
    success: function (response) {
      console.log(response);
      document.cookie="access_token="+response + ";path=/";
      localStorage.setItem("loggedInAs", email);
      console.log('authenticated');
      $('.fl-admin-menu__item--login').addClass('hidden');
      $('.fl-admin-menu__item--logout').removeClass('hidden');
      viewController();
    },
    error: function (response) {
      handleApiError(response);
    }
  });
  return true;
}
