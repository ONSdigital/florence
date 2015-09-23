function releaseEditor(collectionId, data) {
  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  $("#title").on('input', function () {
    $data.description.title = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  dateTmp = data.description.releaseDate;
  var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
  $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
    var result = confirm('You will need to add an explanation for this change. Are you sure you want to proceed?');
    if (result === true) {
      saveOldDate(collectionId, data, dateTmp);
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
    } else {
      e.preventDefault();
    }
  });
  $("#nextRelease").on('input', function () {
    data.description.nextRelease = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function (id) {
    if (id === 'natStat') {
      if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
        return false;
      } else {
        return true;
      }
    } else if (id === 'cancelled') {
      if (data.description.cancelled === "false" || data.description.cancelled === false) {
        return false;
      } else {
        return true;
      }
    }
  };

  // Gets status of checkbox and sets JSON to match
  $("#natStat input[type='checkbox']").prop('checked', checkBoxStatus($('#natStat').attr('id'))).click(function () {
    data.description.nationalStatistic = $("#natStat input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $("#cancelled input[type='checkbox']").prop('checked', checkBoxStatus($('#cancelled').attr('id'))).click(function () {
    data.description.cancelled = $("#cancelled input[type='checkbox']").prop('checked') ? true : false;
    if (data.description.cancelled) {
      var editedSectionValue = '';
      var saveContent = function (updatedContent) {
        data.description.cancellationNotice = [updatedContent];
        postContent(collectionId, data.uri, JSON.stringify(data),
          success = function () {
            Florence.Editor.isDirty = false;
            loadPageDataIntoEditor(data.uri, collectionId);
            refreshPreview(data.uri);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this page. It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    } else {
      data.description.cancellationNotice = [];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $("#dateChange").on('input', function () {
    data.dateChanges.previousDate = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  function saveOldDate(collectionId, data, oldDate) {
    data.dateChanges.push({previousDate: oldDate, changeNotice: ""});
    initialiseLastNoteMarkdown(collectionId, data, 'dateChanges', 'changeNotice');
  }

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });
}

