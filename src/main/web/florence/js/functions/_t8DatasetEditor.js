function datasetEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  //var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });


  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  //resolveVersionCorrectionTitleT8(collectionId, data, 'versions');

  //Add parent link onto page
  var parentUri = getParentPage(data.uri);
  $.ajax ({
    url: parentUri + "/data",
    dataType: 'json',
    crossDomain: true,
    success: function (data) {
      //Add title to parent link area
      var parentTitle = data.description.title;
      $('.child-page__title').append(parentTitle);
    },
    error: function() {
      sweetAlert("Error", "Could not find parent that this is a sub page of", "error");
    }
  });

  //Add link back to parent page
  $('.child-page').append("<a class='child-page__link'>Back to parent page</a>");

  //Take user to parent edit screen on link click
  $('.child-page__link').click(function(){
    //If there are edits check whether user wants to continue
    if (Florence.Editor.isDirty) {
      swal ({
        title: "Warning",
        text: "You have unsaved changes. Are you sure you want to continue?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function (result) {
        if (result === true) {
          Florence.Editor.isDirty = false;
          //Return to parent if user confirms it
          updateContent(collectionId, data.uri, JSON.stringify(data), parentUri);
          return true;
        }
      });
    } else {
      //Return to parent
      updateContent(collectionId, data.uri, JSON.stringify(data), parentUri);
    }
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
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

  function save() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-supplementary-files").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#supplementary-files-title_' + nameF).val();
      var file = data.supplementaryFiles[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.supplementaryFiles = newFiles;
    // Notes
    data.section = {markdown: $('#one-markdown').val()};
  }
}

//function resolveVersionCorrectionTitleT8(collectionId, data, field) {
//  var ajaxRequest = [];
//  var templateData = $.extend(true, {}, data);
//  $(templateData[field]).each(function (index, version) {
//    var dfd = $.Deferred();
//    if (version.correctionNotice) {
//      templateData[field][index].type = true;
//    } else {
//      templateData[field][index].type = false;
//    }
//    templateData[field][index].label = version.label;
//    dfd.resolve();
//    ajaxRequest.push(dfd);
//  });
//
//  $.when.apply($, ajaxRequest).then(function () {
//
//    initialiseDatasetVersion(collectionId, data, templateData, 'versions', 'version');
//    initialiseDatasetVersion(collectionId, data, templateData, 'versions', 'correction');
//
//    // Version/Correction section
//    // New version
//    $("#add-version").one('click', function () {
//      //console.log("clicked");
//      editDatasetVersion(collectionId, data, templateData, 'versions', 'version');
//    });
//
//    // New correction
//    $("#add-correction").one('click', function () {
//      editDatasetVersion(collectionId, data, templateData, 'versions', 'correction');
//    });
//  });
//}

