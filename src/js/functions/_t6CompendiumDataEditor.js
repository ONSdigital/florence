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
    //if (!Florence.collection.date) {                    //overwrite scheduled collection date
    if (!data.description.releaseDate) {
        $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
            data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
        });
    } else {
        dateTmp = data.description.releaseDate;
        var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
        $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
            data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
        });
    }
    //} else {
    //    $('.release-date').hide();
    //}
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

    /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
     is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
    var checkBoxStatus = function () {
        if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
            return false;
        } else {
            return true;
        }
    };
    $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
        data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    });

    // Save
    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '#save', function () {
        save();
        updateContent(collectionId, data.uri, JSON.stringify(data));
    });

    // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        //pageData = $('.fl-editor__headline').val();
        save();
        saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        save();
        saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
    });

    function save() {

        Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

        // Files are uploaded. Save metadata
        var orderFile = $("#sortable-file").sortable('toArray');
        $(orderFile).each(function (indexF, nameF) {
            var title = $('#file-title_' + nameF).val();
            var fileDescription = $("#file-summary_" + nameF).val();
            var file = data.downloads[parseInt(nameF)].file;
            newFiles[indexF] = {title: title, fileDescription: fileDescription, file: file};
        });
        data.downloads = newFiles;
    }
}

