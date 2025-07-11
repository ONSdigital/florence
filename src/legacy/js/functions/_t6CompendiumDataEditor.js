function compendiumDataEditor(collectionId, data) {
    var newFiles = [];
    var parentUrl = getParentPage(data.uri);
    var setActiveTab, getActiveTab;

    //Add parent link onto page
    loadParentLink(collectionId, data, parentUrl);

    $(".edit-accordion").on('accordionactivate', function (event, ui) {
        setActiveTab = $(".edit-accordion").accordion("option", "active");
        if (setActiveTab !== false) {
            Florence.globalVars.activeTab = setActiveTab;
        }
    });

    getActiveTab = Florence.globalVars.activeTab;
    accordion(getActiveTab);
    getLastPosition();

    // Metadata edition and saving
    $("#title").on('input', function () {
        $(this).textareaAutoSize();
        sweetAlert("Cannot remame this page here", "Go back to parent page and use the rename function there");
    });
    $("#summary").on('input', function () {
        $(this).textareaAutoSize();
        data.description.summary = $(this).val();
    });
    if (!data.description.releaseDate) {
        $('#releaseDate').datepicker({ dateFormat: 'dd MM yy' }).on('change', function () {
            data.description.releaseDate = new Date($(this).datepicker({ dateFormat: 'dd MM yy' })[0].value).toISOString();
        });
    } else {
        dateTmp = data.description.releaseDate;
        var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
        $('#releaseDate').val(dateTmpFormatted).datepicker({ dateFormat: 'dd MM yy' }).on('change', function () {
            data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
        });
    }
    $("#nextRelease").on('input', function () {
        $(this).textareaAutoSize();
        data.description.nextRelease = $(this).val();
    });
    if (!data.description.contact) {
        data.description.contact = {};
    }
    $("#contactName").on('input', function () {
        $(this).textareaAutoSize();
        data.description.contact.name = $(this).val();
    });
    $("#contactEmail").on('input', function () {
        $(this).textareaAutoSize();
        data.description.contact.email = $(this).val();
    });
    $("#contactTelephone").on('input', function () {
        $(this).textareaAutoSize();
        data.description.contact.telephone = $(this).val();
    });
    $("#datasetId").on('input', function () {
        $(this).textareaAutoSize();
        data.description.datasetId = $(this).val();
    });
    $("#keywordsTag").tagit({
        availableTags: data.description.keywords,
        singleField: true,
        allowSpaces: true,
        singleFieldNode: $('#keywords')
    });
    $('#keywords').on('change', function () {
        data.description.keywords = $('#keywords').val().split(',');
    });
    $("#metaDescription").on('input', function () {
        $(this).textareaAutoSize();
        data.description.metaDescription = $(this).val();
    });

    /* The checked attribute is a boolean attribute and the corresponding property 
    will be true if the attribute is present and has a value other than false */
    var checkBoxStatus = function (value) {
        if (value === "" || value === "false" || value === false) {
            return false;
        }
        return true;
    };

    $("#natStat-checkbox").prop('checked', checkBoxStatus(data.description.nationalStatistic)).click(function () {
        data.description.nationalStatistic = $("#natStat-checkbox").prop('checked');
    });

    // Save
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
        save("update");
    });

    // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        save("complete");
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        save("review");
    });

    function save(action) {
        if (!validateMigrationPath(data.description.migrationLink)) {
            sweetAlert(...MIGRATION_FIELD_VALIDATION_FAILURE);
            return
        }

        Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

        // Files are uploaded. Save metadata
        var orderFile = $("#sortable-file").sortable('toArray');
        $(orderFile).each(function (indexF, nameF) {
            var title = $('#file-title_' + nameF).val();
            var fileDescription = $("#file-summary_" + nameF).val();
            var file = data.downloads[parseInt(nameF)].file;
            newFiles[indexF] = { title: title, fileDescription: fileDescription, file: file };
        });
        data.downloads = newFiles;

        switch (action) {
            case "complete":
                saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
                break;
            case "review":
                saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
                break;
            default:
                updateContent(collectionId, data.uri, JSON.stringify(data));
        }
    }
}

