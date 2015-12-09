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
  getUsers(
    function (users) {
      var teamsHtml = templates.teamEdit({team: team, user: users});
      $('.section').append(teamsHtml);

      $('.btn-team-selector-cancel').click(function () {
        $('.team-select').stop().fadeOut(200).remove();
      });

      $(function () {
        $('.user-list > li').draggable({
          appendTo: 'document',
          helper: 'clone',
          cursor: 'move'
        });

        $('.team-list > li').draggable({
          appendTo: 'document',
          cursor: 'move'
        });

        $('.user-list').droppable({
          accept: ".team-list > li",
          drop: function (event, ui) {
            var targetElem = $(this).attr("id");
            $(this).addClass("ui-state-highlight");
            $(ui.draggable).appendTo(this);
            deleteTeamMember(team.name, ui.draggable[0].firstChild.textContent);
          }
        });

        $('.team-list').droppable({
          accept: ".user-list > li",
          drop: function (event, ui) {
            var targetElem = $(this).attr("id");
            $(this).addClass("ui-state-highlight");
            $(ui.draggable).appendTo(this);
            postTeamMember(team.name, ui.draggable[0].firstChild.textContent);
          }
        });
      });
    },
    function (jqxhr) {
      handleApiError(jqxhr);
    }
  );
}
