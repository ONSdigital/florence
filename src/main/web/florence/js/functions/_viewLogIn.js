function viewLogIn() {

var login_form =
  'email:<input type="email" value="florence@magicroundabout.ons.gov.uk" class="fl-user-and-access__email" name="fl-editor__headline" cols="40" rows="1" />' +
  '<br>'+
  'password:<input type="password" value="Doug4l" class="fl-user-and-access__password" name="fl-editor__headline" cols="40" rows="1" />'+
  '<br>'+
  '<button class="fl-panel--user-and-access__login">Log in</button>';

  $('.fl-view').prepend(login_form);

  $('.fl-panel--user-and-access__login').click(function(){
    var email = $('.fl-user-and-access__email').val();
    var password = $('.fl-user-and-access__password').val();
    console.log(email);
    console.log(password);
    authenticate(email,password);
  })
}

