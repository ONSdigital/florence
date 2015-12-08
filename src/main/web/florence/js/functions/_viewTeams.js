function viewTeams() {

  getTeams(
    success = function (data) {
      //console.log(data);
      populateTeamsTable(data);
    },
    error = function (jqxhr) {
      handleApiError(jqxhr);
    }
  );

  function populateTeamsTable(data) {

    var teamsHtml = templates.teamList(data);
    $('.section').html(teamsHtml);

    //if (collectionId) {
    //  $('.collections-select-table tr[data-id="' + collectionId + '"]')
    //    .addClass('selected');
    //  viewCollectionDetails(collectionId);
    //}

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var teamId = $(this).attr('data-id');
      viewUserDetails(teamId);
    });

    $('.form-create-team').submit(function (e) {
      e.preventDefault();

      var teamName = $('#create-team-name').val();

      if (teamName.length < 1) {
        sweetAlert("Please enter the users name.");
        return;
      }

      postTeam(name);
    });
  }
}


