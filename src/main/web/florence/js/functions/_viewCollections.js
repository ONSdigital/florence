function viewCollections(collectionId) {

    var result = {};
    var pageDataRequests = []; // list of promises - one for each ajax request.
    pageDataRequests.push(
        $.ajax({
            url: "/zebedee/collections",
            type: "get",
            success: function (data) {
                result.data = data;
            },
            error: function (jqxhr) {
                handleApiError(jqxhr);
            }
        })
    );
    pageDataRequests.push(
        getTeams(
            success = function (team) {
                result.team = team;
            },
            error = function (response) {
                handleApiError(response);
            }
        )
    );

    $.when.apply($, pageDataRequests).then(function () {

        var response = [], teams = [];

        $.each(result.data, function (i, collection) {
            if (!collection.approvedStatus) {
                if (!collection.publishDate) {
                    date = '[manual collection]';
                    response.push({id: collection.id, name: collection.name, date: date});
                } else if (collection.publishDate && collection.type === 'manual') {
                    var formattedDate = StringUtils.formatIsoDateString(collection.publishDate) + ' [rolled back]';
                    response.push({id: collection.id, name: collection.name, date: formattedDate});
                } else {
                    var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
                    response.push({id: collection.id, name: collection.name, date: formattedDate});
                }
            }
        });

        var isDataVis = false;
        if (Florence.Authentication.userType() === "dataVisPublisher") {
            isDataVis = true;
        }
        var collectionsHtml = templates.collectionList({response: response, teams: result.team.teams, isDataVis: isDataVis});
        $('.section').html(collectionsHtml);

        if (collectionId) {
            $('.collections-select-table tr[data-id="' + collectionId + '"]')
                .addClass('selected');
            viewCollectionDetails(collectionId);
        }

        $('.collections-select-table tbody tr').click(function () {
            $('.collections-select-table tbody tr').removeClass('selected');
            $(this).addClass('selected');
            var collectionId = $(this).attr('data-id');
            viewCollectionDetails(collectionId);
        });

        $("#team-tag").tagit({
            singleField: true,
            singleFieldNode: $('#team-input')
        });

        $('.ui-autocomplete-input').hide();

        $('select#team').change(function () {
            $('#team-tag').tagit('createTag', $("#team option:selected").text());
        });

        $('#team-input').change(function () {
            teams = $('#team-input').val().split(',');
            //After creating the array tagit leaves an empty string if all elements are removed
            if (teams.length === 1 && teams[0] === "") {
                teams = [];
            }
        });

        $('form input[type=radio]').click(function () {

            if ($(this).val() === 'manual') {
                $('#scheduledPublishOptions').hide();
            } else if ($(this).val() === 'scheduled') {
                $('#scheduledPublishOptions').show();
            } else if ($(this).val() === 'custom') {
                $('#customScheduleOptions').show();
                $('#releaseScheduleOptions').hide();
            } else if ($(this).val() === 'release') {
                $('#customScheduleOptions').hide();
                $('#releaseScheduleOptions').show();
            }
        });


        $(function () {
            var today = new Date();
            $('#date').datepicker({
                minDate: today,
                dateFormat: 'dd/mm/yy',
                constrainInput: true
            });
        });


        $('.btn-select-release').on("click", function (e) {
            e.preventDefault();
            viewReleaseSelector();
        });

        $('.form-create-collection').submit(function (e) {
            e.preventDefault();
            createCollection(teams);
        });
    });
}