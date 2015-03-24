function callZebedee(success,error,opts){
  var zebedeeUrl,endpoint,crossDomain,type,data,url;

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
            document.cookie="access_token="+response
            console.log('authenticated')
        },
        error: function (response) {
            console.log('fail');
        }
    });
}
