function viewUserAndAccess(view) {

  $.ajax({
    url: "/zebedee/users",
    type: "get",
    success: function (data) {
      console.log(data);
      populateUsersTable(data);
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

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
      createUser();
    });
  }


  //
  //  function createUser(name, email, password) {
  //    $.ajax({
  //      url: "/zebedee/users",
  //      dataType: 'json',
  //      contentType: 'application/json',
  //      type: 'POST',
  //      data: JSON.stringify({
  //        name: name,
  //        email: email,
  //      }),
  //      success: function () {
  //        console.log('User created');
  //        setPassword(email, password);
  //      },
  //      error: function (response) {
  //        handleApiError(response);
  //      }
  //    });
  //  }
  //
  //  function setPassword(email, password) {
  //    $.ajax({
  //      url: "/zebedee/password",
  //      dataType: 'json',
  //      contentType: 'application/json',
  //      type: 'POST',
  //      data: JSON.stringify({
  //        password: password,
  //        email: email
  //      }),
  //      success: function () {
  //        console.log('Password set');
  //        alert("User created");
  //      },
  //      error: function (response) {
  //        handleApiError(response);
  //      }
  //    });
  //  }
  //}
}

