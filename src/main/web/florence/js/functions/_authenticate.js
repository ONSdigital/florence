function authenticate(email,password){
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
      console.log('authenticated');
      viewController();
    },
    error: function (response) {
      handleApiError(response)
    }
  });

	return true;
}
