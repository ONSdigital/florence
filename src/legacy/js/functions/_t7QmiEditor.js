function qmiEditor(collectionId, data) {
    var newFiles = [];
    var setActiveTab, getActiveTab;
    var renameUri = false;

    $(".edit-accordion").on('accordionactivate', function (event, ui) {
        setActiveTab = $(".edit-accordion").accordion("option", "active");
        if (setActiveTab !== false) {
            Florence.globalVars.activeTab = setActiveTab;
        }
    });

    getActiveTab = Florence.globalVars.activeTab;
    accordion(getActiveTab);
    getLastPosition();

    $("#metadata-ad").remove();
    $("#metadata-f").remove();
    $("#metadata-md").remove();
    $("#metadata-s").remove();
    $("#summary-p").remove();
    $(".release-date").remove();
    $("#reference-p").remove();

    // Metadata edition and saving
    $("#title").on('input', function () {
        renameUri = true;
        $(this).textareaAutoSize();
        data.description.title = $(this).val();
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
    $("#survey").on('input', function () {
        $(this).textareaAutoSize();
        data.description.surveyName = $(this).val();
    });
    $("#frequency").on('input', function () {
        $(this).textareaAutoSize();
        data.description.frequency = $(this).val();
    });
    $("#compilation").on('input', function () {
        $(this).textareaAutoSize();
        data.description.compilation = $(this).val();
    });
    $("#geoCoverage").on('input', function () {
        $(this).textareaAutoSize();
        data.description.geographicCoverage = $(this).val();
    });
    $("#sampleSize").on('input', function () {
        $(this).textareaAutoSize();
        data.description.sampleSize = $(this).val();
    });
    if (!data.description.lastRevised) {
        $('#lastRevised').datepicker({ dateFormat: 'dd MM yy' }).on('change', function () {
            data.description.lastRevised = new Date($(this).datepicker({ dateFormat: 'dd MM yy' })[0].value).toISOString();
        });
    } else {
        dateTmp = data.description.lastRevised;
        var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
        $('#lastRevised').val(dateTmpFormatted).datepicker({ dateFormat: 'dd MM yy' }).on('change', function () {
            data.description.lastRevised = new Date($('#lastRevised').datepicker('getDate')).toISOString();
        });
    }
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
        save(updateContent);
    });

    // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        save(saveAndCompleteContent);
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        save(saveAndReviewContent);
    });

    function save(onSave) {
        if (!validateMigrationPath(data.description.migrationLink)) {
            sweetAlert(...MIGRATION_FIELD_VALIDATION_FAILURE);
            return
        }

        validateAndSaveTags(data);

        Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

        // Sections
        data.markdown = [$('#content-markdown').val()];
        // Files are uploaded. Save metadata
        var orderFile = $("#sortable-file").sortable('toArray');
        $(orderFile).each(function (indexF, nameF) {
            var title = $('#file-title_' + nameF).val();
            var file = data.downloads[parseInt(nameF)].file;
            newFiles[indexF] = { title: title, file: file };
        });
        data.downloads = newFiles;

        checkRenameUri(collectionId, data, renameUri, onSave);
    }
}
