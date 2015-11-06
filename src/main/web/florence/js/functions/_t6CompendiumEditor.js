function compendiumEditor(collectionId, data, templateData) {

//  var index = data.release;
  var newChapters = [], newRelatedMethodology = [], newDocuments = [], newData = [];
  var lastIndexChapter, lastIndexDataset;
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

  resolveTitleT6(collectionId, data, templateData, 'chapters');
  resolveTitleT6(collectionId, data, templateData, 'datasets');

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#edition").on('input', function () {
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  //if (!Florence.collection.date) {                    //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //  $('.release-date').hide();
  //}
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
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
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#headline").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  // Correction section
  // Load
  $(data.correction).each(function (index, correction) {

    $("#correction_text_" + index).on('input', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('input', function () {
      data.correction[index].date = $(this).val();
    });

    // Delete
    $("#correction-delete_" + index).click(function () {
      $("#" + index).remove();
      data.correction.splice(index, 1);
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text: "", date: ""});
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  //Add new chapter
  $("#add-chapter").one('click', function () {
    var chapterTitle;
    $('#sortable-chapter').append(
      '<div id="' + lastIndexChapter + '" class="edit-section__sortable-item">' +
      '<textarea class="auto-size" id="new-chapter-title" placeholder="Type title here and click add"></textarea>' +
      '<button class="btn-markdown-edit" id="chapter-add">Edit chapter</button>' +
      '</div>');
    $('#new-chapter-title').on('input', function () {
      $(this).textareaAutoSize();
      chapterTitle = $(this).val();
    });
    $('#chapter-add').on('click', function () {
      if (chapterTitle.length < 5) {
        alert("This is not a valid file title");
        return true;
      } else {
        loadT6Creator(collectionId, data.description.releaseDate, 'compendium_chapter', data.uri, chapterTitle);
      }
    });
  });

  //Add new table (only one per compendium)
  if (!data.datasets || data.datasets.length === 0) {
    $("#add-compendium-data").one('click', function () {
      var tableTitle;
      $('#sortable-compendium-data').append(
        '<div id="' + lastIndexDataset + '" class="edit-section__item">' +
        '<textarea class="auto-size" id="new-compendium-data-title" placeholder="Type title here and click add"></textarea>' +
        '<button class="btn-markdown-edit" id="compendium-data-add">Edit data</button>' +
        '</div>');
      $('#new-compendium-data-title').on('input', function () {
        $(this).textareaAutoSize();
        tableTitle = $(this).val();
      });
      $('#compendium-data-add').on('click', function () {
        if (tableTitle.length < 5) {
          alert("This is not a valid file title");
          return true;
        } else {
          loadT6Creator(collectionId, data.description.releaseDate, 'compendium_data', data.uri, tableTitle);
        }
      });
    });
  } else {
    $('#add-compendium-data').hide().one('click', function () {
      alert('At the moment you can have one section here.');
    });
  }

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
    // Chapters
    var orderRelatedChapter = $("#sortable-chapter").sortable('toArray');
    $(orderRelatedChapter).each(function (indexC, nameC) {
      var uri = data.chapters[parseInt(nameC)].uri;
      var safeUri = checkPathSlashes(uri);
      newChapters[indexC] = {uri: safeUri};
    });
    data.chapters = newChapters;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related data
    var orderData = $("#sortable-data").sortable('toArray');
    $(orderData).each(function (indexDat, nameDat) {
      var uri = data.relatedData[parseInt(nameDat)].uri;
      var safeUri = checkPathSlashes(uri);
      newData[indexDat] = {uri: safeUri};
    });
    data.relatedData = newData;
    // Related methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function (indexM, nameM) {
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes(uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

function resolveTitleT6(collectionId, data, templateData, field) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].description.title = response.title;
        dfd.resolve();
      },
      error = function () {
        alert(field + ' address: ' + eachUri + ' is not found.');
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    if (field === 'datasets') {
      var html = templates.workEditT6Dataset(dataTemplate);
    } else {
      var html = templates.workEditT6Chapter(dataTemplate);
    }
    $('#' + field).replaceWith(html);

    if (field === 'datasets') {
      editData(collectionId, data);
    } else {
      editChapters(collectionId, data);
    }
  });
}

function editChapters(collectionId, data) {
  // Edit chapters
  // Load chapter to edit
  $(data.chapters).each(function (index) {
    lastIndexChapter = index + 1;

    $("#chapter-edit_" + index).click(function () {
      //open document
      var selectedChapter = $("#chapter-title_" + index).attr('data-url');
      //refreshPreview(selectedChapter);
      createWorkspace(selectedChapter, collectionId, 'edit');
    });

    // Delete
    $("#chapter-delete_" + index).click(function () {
      var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
      if (result === true) {
        var selectedChapter = $("#chapter-title_" + index).attr('data-url');
        var path = data.uri;
        $("#" + index).remove();
        data.chapters.splice(index, 1);
        postContent(collectionId, path, JSON.stringify(data),
          success = function () {
            Florence.Editor.isDirty = false;
            deleteContent(collectionId, selectedChapter, function () {
              refreshPreview(path);
              loadPageDataIntoEditor(path, collectionId);
            }, error);
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
      }
    });
  });

  function sortableSections() {
    $("#sortable-chapter").sortable();
  }

  sortableSections();
}

function editData(collectionId, data) {
  // Edit data reference table
  // Load table to edit
  if (!data.datasets || data.datasets.length === 0) {
    lastIndexDataset = 0;
  } else {
    $(data.datasets).each(function (index) {
      $("#compendium-data-edit_" + index).click(function () {
        //open document
        var selectedData = $("#compendium-data-title_" + index).attr('data-url');
        refreshPreview(selectedData);
        viewWorkspace(selectedData, collectionId, 'edit');
      });

      // Delete
      $("#compendium-data-delete_" + index).click(function () {
        var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
        if (result === true) {
          var selectedData = $("#compendium-data-title_" + index).attr('data-url');
          var path = data.uri;
          $("#" + index).remove();
          data.datasets.splice(index, 1);
          postContent(collectionId, path, JSON.stringify(data),
            success = function () {
              Florence.Editor.isDirty = false;
              deleteContent(collectionId, selectedData, function () {
                refreshPreview(path);
                loadPageDataIntoEditor(path, collectionId);
              }, error);
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
        }
      });
    });
  }
}

