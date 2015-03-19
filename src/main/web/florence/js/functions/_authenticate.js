function authenticate(email,password){
	//
  var email,password, credentials;
  email = 'kane.a.s.morgan@gmail.com';
  password = 'bluecat';
  console.log(email)
  $.ajax({
        url: "http://localhost:8082/login",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({
          email:email,
          password:password
        }),
        success: function (response) {
            console.log(response)
            document.cookie="access_token="+response
            console.log('authenticated')
        },
        error: function (response) {
            console.log('fail');
        }
    });

	return true;
}
