function viewUsers(view) {

  getUsers(
    success = function (data) {
      //console.log(data);
      populateUsersTable(data);
    },
    error = function (jqxhr) {
      handleApiError(jqxhr);
    }
  );

  function populateUsersTable(data) {

    var usersHtml = templates.userList(data);
    $('.section').html(usersHtml);

    //if (collectionId) {
    //  $('.collections-select-table tr[data-id="' + collectionId + '"]')
    //    .addClass('selected');
    //  viewCollectionDetails(collectionId);
    //}

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var userId = $(this).attr('data-id');
      viewUserDetails(userId);
    });

    $('.form-create-user').submit(function (e) {
      e.preventDefault();

      var username = $('#create-user-username').val();
      var email = $('#create-user-email').val();
      var password = $('#create-user-password').val();

      if (username.length < 1) {
        alert("Please enter the users name.");
        return;
      }

      if (email.length < 1) {
        alert("Please enter the users name.");
        return;
      }

      if (password.length < 1) {
        alert("Please enter the users password.");
        return;
      }

      createUser(username, email, password);
    });
  }


  function createUser(name, email, password) {
    $.ajax({
      url: "/zebedee/users",
      dataType: 'json',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({
        name: name,
        email: email
      }),
      success: function () {
        console.log('User created');
        setPassword(email, password);
      },
      error: function (response) {
        if (response.status === 403 || response.status === 401) {
          alert("You are not permitted to create users.")
        }
        else if (response.status === 409) {
          alert(response.responseJSON.message)
        } else {
          handleApiError(response);
        }
      }
    });
  }

  function setPassword(email, password) {
    $.ajax({
      url: "/zebedee/password",
      dataType: 'json',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({
        password: password,
        email: email
      }),
      success: function () {
        console.log('Password set');
        alert("User created");
        viewController('users');
      },
      error: function (response) {
        handleApiError(response);
      }
    });
  }
}

