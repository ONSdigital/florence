function viewCollections(collectionId) {

    if (collectionId) {
        location.href = location.origin + "/florence/collections/" + collectionId;
    } else {
        location.pathname = "/florence/collections";
    }


    // var result = {};
    // var pageDataRequests = []; // list of promises - one for each ajax request.
    // pageDataRequests.push(
    //     $.ajax({
    //         url: "/zebedee/collections",
    //         type: "get",
    //         success: function (data) {
    //             result.data = data;
    //         },
    //         error: function (jqxhr) {
    //             handleApiError(jqxhr);
    //         }
    //     })
    // );
    // pageDataRequests.push(
    //     getTeams(
    //         success = function (team) {
    //             result.team = team;
    //         },
    //         error = function (response) {
    //             handleApiError(response);
    //         }
    //     )
    // );

    // $.when.apply($, pageDataRequests).then(function () {

    //     var response = [], teams = [], date = "";

    //     $.each(result.data, function (i, collection) {
    //         var approvalStates = {inProgress: false, thrownError: false, completed: false, notStarted: false};

    //         if (collection.approvalStatus != "COMPLETE") {

    //             // Set publish date
    //             if (!collection.publishDate) {
    //                 date = '[manual collection]';
    //             } else if (collection.publishDate && collection.type === 'manual') {
    //                 date = StringUtils.formatIsoDateString(collection.publishDate) + ' [rolled back]';
    //             } else {
    //                 date = StringUtils.formatIsoDateString(collection.publishDate);
    //             }

    //             // Set approval state
    //             switch (collection.approvalStatus) {
    //                 case (undefined): {
    //                     break;
    //                 }
    //                 case ('NOT_STARTED'): {
    //                     approvalStates.notStarted = true;
    //                     break;
    //                 }
    //                 case ('IN_PROGRESS'): {
    //                     approvalStates.inProgress = true;
    //                     break;
    //                 }
    //                 case ('COMPLETE'): {
    //                     approvalStates.completed = true;
    //                     break;
    //                 }
    //                 case ('ERROR'): {
    //                     approvalStates.thrownError = true;
    //                     break;
    //                 }
    //             }

    //             response.push({id: collection.id, name: collection.name, date: date, approvalState: approvalStates});
    //         }
    //     });

    //     var isDataVis = false;
    //     if (Florence.Authentication.userType() === "DATA_VISUALISATION") {
    //         isDataVis = true;
    //     }
    //     var collectionsHtml = templates.collectionList({response: response, teams: result.team.teams, isDataVis: isDataVis});
    //     $('.section').html(collectionsHtml);

    //     if (collectionId) {
    //         viewCollectionDetails(collectionId, $('.js-selectable-table tr[data-id="' + collectionId + '"]'));
    //     }

    //     $('.js-selectable-table tbody tr').click(function () {
    //         var collectionId = $(this).attr('data-id');
    //         viewCollectionDetails(collectionId, $(this));
    //     });

    //     $("#team-tag").tagit({
    //         singleField: true,
    //         singleFieldNode: $('#team-input')
    //     });

    //     $('.ui-autocomplete-input').hide();

    //     $('select#team').change(function () {
    //         $('#team-tag').tagit('createTag', $("#team option:selected").text());
    //     });

    //     $('#team-input').change(function () {
    //         teams = $('#team-input').val().split(',');
    //         //After creating the array tagit leaves an empty string if all elements are removed
    //         if (teams.length === 1 && teams[0] === "") {
    //             teams = [];
    //         }
    //     });

    //     $('form input[type=radio]').click(function () {

    //         if ($(this).val() === 'manual') {
    //             $('#scheduledPublishOptions').hide();
    //         } else if ($(this).val() === 'scheduled') {
    //             $('#scheduledPublishOptions').show();
    //         } else if ($(this).val() === 'custom') {
    //             $('#customScheduleOptions').show();
    //             $('#releaseScheduleOptions').hide();
    //         } else if ($(this).val() === 'release') {
    //             $('#customScheduleOptions').hide();
    //             $('#releaseScheduleOptions').show();
    //         }
    //     });


    //     $(function () {
    //         var today = new Date();
    //         $('#date').datepicker({
    //             minDate: today,
    //             dateFormat: 'dd/mm/yy',
    //             constrainInput: true
    //         });
    //     });


    //     $('.btn-select-release').on("click", function (e) {
    //         e.preventDefault();
    //         viewReleaseSelector();
    //     });

    //     $('.form-create-collection').submit(function (e) {
    //         e.preventDefault();
    //         createCollection(teams);
    //     });
    // });
}