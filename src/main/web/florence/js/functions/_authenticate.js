function authenticate(){
	//
  var email,password, credentials;
  email = 'kane.a.s.morgan@gmail.com';
  password = 'password';
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
            console.log('authenticated')
        },
        error: function (response) {
            console.log('fail');
        }
    });

	return true;
}
