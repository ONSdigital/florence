/**
 * Display the details of the team with the given name.
 * @param teamName
 * @param $this = jQuery object of selected table item
 */
function viewTeamDetails(teamName, $this) {

    getTeams(
        success = function (team) {
            populateTeamDetails(team, $this);
        },
        error = function (response) {
            handleApiError(response);
        },
        teamName
    );

    function populateTeamDetails(team, $this) {

        var showPanelOptions = {
            html: window.templates.teamDetails(team)
        };
        showPanel($this, showPanelOptions);

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

        $('.btn-team-cancel').click(function () {
            hidePanel({});
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
            //console.log("UA: " + userArray);
            userNotInTeam = _.difference(userArray, team.members);
            //console.log("UNIT: " + userNotInTeam);
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

            $('.user-list').on('click', '.btn-team-add', function() {
                console.log('you clicked add');
                var $this = $(this),
                    $li = $this.parent('li'),
                    $email = $this.data('email');
                $li.remove();
                moveUser($email, true)
                postTeamMember(team.name, $email);
                userNotInTeam = _.difference(userNotInTeam, [$email]);

            });


            $('.team-list').on('click', '.btn-team-remove', function() {
                console.log('you clicked remove');
                var $this = $(this),
                    $li = $this.parent('li'),
                    $email = $this.data('email');
                $li.remove();
                moveUser($email, false)
                deleteTeamMember(team.name, $email);
                userNotInTeam.push($email);
            });

            //dragAndDrop();
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
                    userList.append('<li >' + user + ' <button class="btn-team-list btn-team-add" data-email="' + user + '">Add</button></li>');
                }
            });
        //dragAndDrop();
    }

    //function dragAndDrop() {
    //    $('.user-list > li').draggable({
    //        appendTo: 'document',
    //        helper: 'clone',
    //        cursor: 'move'
    //    });
    //
    //    $('.team-list > li').draggable({
    //        appendTo: 'document',
    //        helper: 'clone',
    //        cursor: 'move'
    //    });
    //
    //    $('.user-list').droppable({
    //        accept: ".team-list > li",
    //        drop: function (event, ui) {
    //            var targetElem = $(this).attr("id");
    //            $(this).addClass("ui-state-highlight");
    //            $(ui.draggable).appendTo(this);
    //            deleteTeamMember(team.name, ui.draggable[0].firstChild.textContent);
    //            userNotInTeam.push(ui.draggable[0].firstChild.textContent);
    //        }
    //    });
    //
    //    $('.team-list').droppable({
    //        accept: ".user-list > li",
    //        drop: function (event, ui) {
    //            var targetElem = $(this).attr("id");
    //            $(this).addClass("ui-state-highlight");
    //            $(ui.draggable).appendTo(this);
    //            postTeamMember(team.name, ui.draggable[0].firstChild.textContent);
    //            userNotInTeam = _.difference(userNotInTeam, [ui.draggable[0].firstChild.textContent]);
    //        }
    //    });
    //};

    /**
     * Handle moving list items between lsits.
     * @param user - email string
     * @param beingAdded - true or false
     */
    function moveUser(user, beingAdded) {
        if (beingAdded) {
            button = '<button class="btn-team-list btn-team-remove" data-email="' + user + '">Remove</button>';
        } else {
            button = '<button class="btn-team-list btn-team-add" data-email="' + user + '">Add</button>';
        }
        var str = '<li>' + user + ' ' + button + '</li>';

        if (beingAdded) {
            $('.team-list').prepend(str);
        } else {
            $('.user-list').prepend(str);
        }
    }
}


