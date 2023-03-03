function articleEditor(collectionId, data) {

  var newChart = [], newTable = [], newEquation = [], newImage = [], newLinks = [], newFiles = [];
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
  setNeutralArticleOptions();

  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
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

  $("#census-checkbox").prop('checked', data.description.survey ? true : false).click(function () {
    data.description.survey = $("#census-checkbox").prop('checked') ? 'census' : null;
  });
  
  $("#articleType-checkbox").click(function () {
      data.isPrototypeArticle = $("#articleType-checkbox").prop('checked');
      if (data.isPrototypeArticle) {
        $("#releaseDateEnabled-checkbox").attr('disabled', false);
        // if neutral article then release date might have been disabled or enabled already, so set it to its true value
        $("#releaseDateEnabled-checkbox").attr('checked', data.isReleaseDateEnabled);
      }
      else {
        $("#releaseDateEnabled-checkbox").attr('disabled', true);
        // If not a neutral article then release date is enabled
        $("#releaseDateEnabled-checkbox").attr('checked', true);
      }
  });
    
    $("#releaseDateEnabled-checkbox").click(function () {
      data.isReleaseDateEnabled = $("#releaseDateEnabled-checkbox").prop('checked');
    });

    $('#neutral-article-image-upload-submit').click(function() {
        var file = document.getElementById("neutral-article-image-upload").files[0];

        if (!file) {
            sweetAlert('Please select a file to upload.');
            return;
        }

        var formData = new FormData();
        formData.append("file", file);
        var fileExtension = file.name.split('.').pop();
        var filename = file.filename ? file.filename : StringUtils.randomId();
        var imagePath = data.uri + "/" + filename + '.' + fileExtension;

        $.ajax({
            url: "/zebedee/content/" + Florence.collection.id + "?uri=" + imagePath,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function () {
                data.imageUri = imagePath;
                save(updateContent);
            },
            error: function (error) {
                sweetAlert("Error", error);
            }
        });
    });

    $('#neutral-article-image-upload-delete').on('click', function () {

        if (data.imageUri) {

            deleteContent(Florence.collection.id, data.imageUri,
                onSuccess = function () {
                    console.log("deleted image file: " + data.imageUri);
                    data.imageUri = "";
                    save(updateContent);
                });
        }
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

    Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();

    validateAndSaveTags(data);

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
    // equations
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
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-pdf").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#pdf-title_' + nameF).val();
      var file = data.pdfTable[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.pdfTable = newFiles;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }

  function setNeutralArticleOptions () {
    if (data.isPrototypeArticle) {
      $("#releaseDateEnabled-checkbox").attr('disabled', false);
      // if neutral article then release date might have been disabled or enabled already, so set it to its true value
      $("#releaseDateEnabled-checkbox").attr('checked', data.isReleaseDateEnabled);
    }
    else {
      $("#releaseDateEnabled-checkbox").attr('disabled', true);
      // If not a neutral article then release date is enabled
      $("#releaseDateEnabled-checkbox").attr('checked', true);

    }
  }
}

