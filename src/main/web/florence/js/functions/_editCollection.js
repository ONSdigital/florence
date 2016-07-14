function editCollection(collection) {

    collection.collectionOwner = Florence.Authentication.userType();

    getTeams(
        success = function (teams) {
            var editPublishTime, toIsoDate;
            var collDetails = $('.js-collection__content').detach();
            var html = templates.collectionEdit({collection: collection, teams: teams.teams});
            $('.js-collection__head').after(html);
            $('.btn-collection-edit').off();

            $('#collection-editor-name').on('input', function () {
                collection.name = $('#collection-editor-name').val();
            });

            $("#editor-team-tag").tagit({
                singleField: true,
                singleFieldNode: $('#editor-team-input'),
                singleFieldDelimiter: ("$$")
            });

            $(collection.teams).each(function (i, team) {
                $('#editor-team-tag').tagit('createTag', team);
            });

            $('.ui-autocomplete-input').hide();

            $('select#editor-team').change(function () {
                $('#editor-team-tag').tagit('createTag', $("#editor-team option:selected").text());
            });

            $('#editor-team-input').change(function () {
                collection.teams = $('#editor-team-input').val().split('$$');
                //After creating the array tagit leaves an empty string if all elements are removed
                if (teams.length === 1 && teams[0] === "") {
                    teams = [];
                }
            });

            if (!collection.publishDate) {
                $('#collection-editor-date').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
                    toIsoDate = $('#collection-editor-date').datepicker("getDate");
                });
            } else {
                dateTmp = collection.publishDate;
                toIsoDate = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
                $('#collection-editor-date').val(toIsoDate).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
                    toIsoDate = $('#collection-editor-date').datepicker("getDate");
                });
            }

            //initial value
            if (collection.type === "manual") {
                $('#collection-editor-date-block').hide();
            } else {
                $('#collection-editor-date-block').show();
            }

            $('input[type=radio]').click(function () {
                if ($(this).val() === 'manualCollection') {
                    collection.type = "manual";
                    $('#collection-editor-date-block').hide();
                } else if ($(this).val() === 'scheduledCollection') {
                    collection.type = "scheduled";
                    $('#collection-editor-date-block').show();
                }
            });

            //More functionality to be added here
            // When scheduled, do we change all the dates in the files in the collection?


            //Save
            $('.btn-collection-editor-save').click(function () {
                //save date and time to collection
                if (collection.type === 'scheduled') {
                    editPublishTime = parseInt($('#collection-editor-hour').val()) + parseInt($('#collection-editor-min').val());
                    collection.publishDate = new Date(parseInt(new Date(toIsoDate).getTime()) + editPublishTime).toISOString();
                } else {
                }
                //check validity
                if (collection.name === '') {
                    sweetAlert('This is not a valid collection name', "A collection name can't be empty");
                    return true;
                }
                if (collection.name.match(/\./)) {
                    sweetAlert('This is not a valid collection name', "You can't use fullstops");
                    return true;
                }
                if ((collection.type === 'scheduled') && (Date.parse(collection.publishDate) < new Date())) {
                    sweetAlert('This is not a valid date. Date cannot be in the past');
                    return true;
                } else {
                    // Update the collection
                    $.ajax({
                        url: "/zebedee/collection/" + collection.id,
                        dataType: 'json',
                        contentType: 'application/json',
                        type: 'PUT',
                        data: JSON.stringify(collection),
                        success: function (updatedCollection) {
                            Florence.setActiveCollection(updatedCollection);
                            //createWorkspace('', updatedCollection.id, 'browse');
                            sweetAlert("Collection amended", "", "success");
                            viewCollections(collection.id);
                        },
                        error: function (response) {
                            if (response.status === 409) {
                                sweetAlert("Error", response.responseJSON.message, "error");
                            }
                            else {
                                handleApiError(response);
                            }
                        }
                    });
                }
            });

            //Cancel
            $('.btn-collection-editor-cancel').click(function () {
                $('.btn-collection-edit').click(function () {
                    editCollection(collection);
                });
                $('.js-collection__edit-modal').remove();
                $('.js-collection__head').after(collDetails);
            });

            setCollectionEditorHeight();
        },
        error = function (jqxhr) {
            handleApiError(jqxhr);
        }
    );
}

function setCollectionEditorHeight() {
    var $contentModal = $('.js-collection__edit-modal'),
        panelHeight = parseInt($('.panel--off-canvas').height()),
        headHeight = parseInt($('.slider__head').outerHeight()),
        contentMargin = (parseInt($contentModal.css('margin-top'))) + (parseInt($contentModal.css('margin-bottom')));

    var contentHeight = panelHeight - headHeight - contentMargin;
    $contentModal.css('height', contentHeight);
}

