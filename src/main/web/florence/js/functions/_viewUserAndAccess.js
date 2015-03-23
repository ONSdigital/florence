function viewUserAndAccess(view){
 if (view == 'create'){

  create_user =
  '<section class="fl-panel fl-panel--user-and-access">' +
    '<section class="fl-creator">' +

      '<section class="fl-user-and-access__create">' +
        '<span class="fl-user-and-access__title"> Enter the name of the new user</span>' +
        '<input class="fl-user-and-access__name" name="fl-editor__headline" cols="40" rows="1"></input>' +
        '<br>' +
        '<span class="fl-user-and-access__title"> enter the email of the new user </span>' +
        '<input class="fl-user-and-access__email" name="fl-editor__headline" cols="40" rows="1"></input>' +
        '<br>' +
        'password:<input class="fl-user-and-access__password" name="fl-editor__headline" cols="40" rows="1"></input>'+
      '</section>' +
    '</section>' +
    '<nav class="fl-panel--user-and-access__nav">' +
      '<button class="fl-panel--user-and-access__create">Create User</button>' +
    '</nav>' +
  '</section>'


  $('.fl-view').prepend(create_user)


  $('.fl-panel--user-and-access__create').click(function(){
    var name  = $('.fl-user-and-access__name').val()
    var email = $('.fl-user-and-access__email').val()
    var password = $('.fl-user-and-access__password').val()
    createUser(name,,password)
  })
  function createUser(name,email,password){

    $.ajax({
        url: "http://localhost:8082/users",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({
          name:name,
          email:email
        }),
        success: function (response) {
          console.log(password)
            setPassword(email,password)
            console.log('created')
        },
        error: function (response) {
            console.log('fail');
        }
    });
  }

  function setPassword(email,password){
    var password = password || 'bluecat';
    console.log(password)
    $.ajax({
        url: "http://localhost:8082/password",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({
          email:email,
          password:password
        }),
        success: function (response) {
            console.log('password set')
        },
        error: function (response) {
            console.log('fail');
        }
    });

  }
  login = ""
 }

 else if (view === "login"){
  var login_form =
  'email:<input class="fl-user-and-access__email" name="fl-editor__headline" cols="40" rows="1"></input>' +
  '<br>'+
  'password:<input class="fl-user-and-access__password" name="fl-editor__headline" cols="40" rows="1"></input>'+
  '<br>'+
  '<button class="fl-panel--user-and-access__login">Log in</button>'

  $('.fl-view').prepend(login_form);

  $('.fl-panel--user-and-access__login').click(function(){

    var email = $('.fl-user-and-access__email').val();
    var password = $('.fl-user-and-access__password').val();
    authenticate(email,password);
  })
 }
}
