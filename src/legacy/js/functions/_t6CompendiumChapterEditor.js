function compendiumChapterEditor(collectionId, data) {

    var newChart = [], newTable = [], newEquation = [], newImage = [], newLinks = [];
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
    $("#headline").on('input', function () {
        $(this).textareaAutoSize();
        data.description.headline = $(this).val();
    });
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
    $("#abstract").on('input', function () {
        $(this).textareaAutoSize();
        data.description._abstract = $(this).val();
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
        save();
        updateContent(collectionId, data.uri, JSON.stringify(data));
    });

    // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
        save();
        saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
        save();
        saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
    });


    function save() {

        Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

        // charts
        var orderChart = $("#sortable-chart").sortable('toArray');
        $(orderChart).each(function (indexCh, nameCh) {
            var uri = data.charts[parseInt(nameCh)].uri;
            var title = data.charts[parseInt(nameCh)].title;
            var filename = data.charts[parseInt(nameCh)].filename;
            var safeUri = checkPathSlashes(uri);
            newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
        });
        data.charts = newChart;

        // tables
        var orderTable = $("#sortable-table").sortable('toArray');
        $(orderTable).each(function (indexTable, nameTable) {
            var uri = data.tables[parseInt(nameTable)].uri;
            var title = data.tables[parseInt(nameTable)].title;
            var filename = data.tables[parseInt(nameTable)].filename;
            var version = data.tables[parseInt(nameTable)].version;
            var safeUri = checkPathSlashes(uri);
            newTable[indexTable] = {uri: safeUri, title: title, filename: filename, version: version};
        });
        data.tables = newTable;
        var orderEquation = $("#sortable-equation").sortable('toArray');
        $(orderEquation).each(function (indexEquation, nameEquation) {
            var uri = data.equations[parseInt(nameEquation)].uri;
            var title = data.equations[parseInt(nameEquation)].title;
            var filename = data.equations[parseInt(nameEquation)].filename;
            var safeUri = checkPathSlashes(uri);
            newEquation[indexEquation] = {uri: safeUri, title: title, filename: filename};
        });
        data.equations = newEquation;
        // images
        var orderImage = $("#sortable-image").sortable('toArray');
        $(orderImage).each(function (indexImage, nameImage) {
            var uri = data.images[parseInt(nameImage)].uri;
            var title = data.images[parseInt(nameImage)].title;
            var filename = data.images[parseInt(nameImage)].filename;
            var safeUri = checkPathSlashes(uri);
            newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
        });
        data.images = newImage;

        // External links
        var orderLink = $("#sortable-link").sortable('toArray');
        $(orderLink).each(function (indexL, nameL) {
            var displayText = data.links[parseInt(nameL)].title;
            var link = $('#link-uri_' + nameL).val();
            newLinks[indexL] = {uri: link, title: displayText};
        });
        data.links = newLinks;
    }
}

