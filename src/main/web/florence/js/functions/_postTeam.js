function postTeam(name) {

    var encodedName = encodeURIComponent(name);
    $.ajax({
        url: "/zebedee/teams/" + encodedName,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            name: encodedName
        }),
        success: function () {
            viewTeams();

            // use time out to give browser time to render. this needs a fix
            setTimeout(function(){
                // find the new team in teams list and add select class
                var select = $("table").find("[data-id='" + name + "']");

                viewTeamDetails(name, select);
             }, 5);

        },
        error: function (response) {
            handleUserPostError(response);
        }
    });

    /**
     * Handle error response from creating the team.
     * @param response
     */
    function handleUserPostError(response) {
        if (response.status === 403 || response.status === 401) {
            sweetAlert("You are not permitted to create teams.");
        }
        else if (response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
        } else {
            handleApiError(response);
        }
    }
}

function postTeamMember(name, email) {
    var encodedName = encodeURIComponent(name);
    $.ajax({
        url: "/zebedee/teams/" + encodedName + "?email=" + email,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({
            name: email
        }),
        success: function () {
            console.log('Team member added: ' + email);
        },
        error: function (response) {
            handleUserPostError(response);
        }
    });

    /**
     * Handle error response from creating the team.
     * @param response
     */
    function handleUserPostError(response) {
        if (response.status === 403 || response.status === 401) {
            sweetAlert("You are not permitted to add users.");
        }
        else if (response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
        } else {
            handleApiError(response);
        }
    }
}
