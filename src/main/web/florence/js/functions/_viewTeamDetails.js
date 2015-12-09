/**
 * Display the details of the team with the given name.
 * @param name
 */
function viewTeamDetails(teamName) {

  getTeams(
    success = function (team) {
      populateTeamDetails(team);
    },
    error = function (response) {
      handleApiError(response);
    },
    teamName
  );

  function populateTeamDetails(team) {

    var html = window.templates.teamDetails(team);
    $('.collection-selected').html(html).animate({right: "0%"}, 500);

    $('.btn-team-delete').click(function () {
      swal({
        title: "Confirm deletion",
        text: "Please enter the name of the team you want to delete",
        type: "input",
        inputPlaceHolder: "Name",
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: "Delete",
        animation: "slide-from-top"
      }, function (result) {
        console.log(result);
        if (result) {
          if (result === teamName) {
            var encodedName = encodeURIComponent(teamName);
            deleteTeam(encodedName);
          } else {
            sweetAlert("Oops!", 'The name you entered did not match the team you want to delete.');
          }
        }
      });
    });

    $('.collection-selected .btn-team-cancel').click(function () {
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
    });

    $('.btn-team-edit-members').click(function () {
      populateMembers(team);
    });
  }
}

function populateMembers(team) {
  var userArray, userNotInTeam;
  getUsers(
  function (users) {
      userArray = _.pluck(users, "email");
      userNotInTeam = _.difference(userArray, team.members);
      var teamsHtml = templates.teamEdit({team: team, user: userNotInTeam});
      $('.section').append(teamsHtml);

      $('#team-search-input').on('input', function () {
        var searchText = $(this).val();
        populateUsersList(userNotInTeam, searchText);
      });

      $('.btn-team-selector-cancel').click(function () {
        $('.team-select').stop().fadeOut(200).remove();
        viewTeamDetails(team.name);
      });

      dragAndDrop();
    },
    function (jqxhr) {
      handleApiError(jqxhr);
    }
  );

  /**
   * Populate the users list from the given array of users.
   * @param users
   */
  function populateUsersList(users, filter) {
    var userList = $('.user-list');
    userList.find('li').remove(); // remove existing table entries

    _(_.sortBy(users, function (user) {
      return user;
    }))
      .each(function (user) {
        if (!filter || (user.toUpperCase().indexOf(filter.toUpperCase()) > -1)) {
          userList.append('<li class="ui-draggable ui-draggable-handle">' + user + '</li>');
        }
      });
    dragAndDrop();
  }

  function dragAndDrop () {
    $('.user-list > li').draggable({
      appendTo: 'document',
      helper: 'clone',
      cursor: 'move'
    });

    $('.team-list > li').draggable({
      appendTo: 'document',
      helper: 'clone',
      cursor: 'move'
    });

    $('.user-list').droppable({
      accept: ".team-list > li",
      drop: function (event, ui) {
        var targetElem = $(this).attr("id");
        $(this).addClass("ui-state-highlight");
        $(ui.draggable).appendTo(this);
        deleteTeamMember(team.name, ui.draggable[0].firstChild.textContent);
        userNotInTeam.push(ui.draggable[0].firstChild.textContent);
      }
    });

    $('.team-list').droppable({
      accept: ".user-list > li",
      drop: function (event, ui) {
        var targetElem = $(this).attr("id");
        $(this).addClass("ui-state-highlight");
        $(ui.draggable).appendTo(this);
        postTeamMember(team.name, ui.draggable[0].firstChild.textContent);
        userNotInTeam = _.difference(userNotInTeam, [ui.draggable[0].firstChild.textContent]);
      }
    });
  };
}
