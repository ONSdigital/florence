function authenticate(email,password){
	//
  var email,password, credentials;
  email = email;
  password = password;

  $.ajax({
        url: "/zebedee/login",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({
          email:email,
          password:password
        }),
        success: function (response) {
            console.log(response)
          document.cookie="access_token="+response + ";path=/";
            console.log('authenticated')
        },
        error: function (response) {
            console.log('fail');
        }
    });

	return true;
}
