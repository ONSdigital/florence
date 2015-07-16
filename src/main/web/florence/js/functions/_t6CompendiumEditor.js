function compendiumEditor(collectionId, data) {

//  var index = data.release;
  var newChapters = [], newRelatedMethodology = [];
  var lastIndexChapter, lastIndexDataset;
  var setActiveTab, getActiveTab;
  var pageUrl = localStorage.getItem('pageurl');

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);
  getLastPosition ();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  if (!Florence.collection.date) {
    if (!data.description.releaseDate){
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = $('#releaseDate').val();
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      });
    }
  } else {
      $('.release-date').hide();
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
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#headline").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline = $(this).val();
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
                        singleField: true,
                        singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = [$('#keywords').val()];
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
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
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
    data.correction.push({text:"", date:""});
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // Edit chapters
  // Load chapter to edit
  $(data.chapters).each(function(index, section) {
    lastIndexChapter = index + 1;

    $("#chapter-edit_"+index).click(function() {
      //open document
      var selectedChapter = $("#chapter-title_"+index).attr('data-url');
      refreshPreview(selectedChapter);
      viewWorkspace(selectedChapter, collectionId, 'edit');
    });

    // Delete
    $("#chapter-delete_"+index).click(function() {
      var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
      if (result === true) {
        var selectedChapter = $("#chapter-title_"+index).attr('data-url');
        var path = data.uri;
        $("#"+index).remove();
        data.chapters.splice(index, 1);
        postContent(collectionId, path, JSON.stringify(data),
          success = function (response) {
            //console.log("Updating completed " + response);
            Florence.Editor.isDirty = false;
            deleteContent(collectionId, selectedChapter, function() {
              refreshPreview(path);
              loadPageDataIntoEditor(path, collectionId);
            }, error);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this file. It is already part of another collection.");
            }
            else if (response.status === 401) {
              alert("You are not authorised to update content.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
    });
  });

  //Add new chapter
  $("#add-chapter").one('click', function () {
    var chapterTitle;
    $('#sortable-chapter').append(
      '<div id="' + lastIndexChapter + '" class="edit-section__sortable-item">' +
      '<textarea class="auto-size" id="new-chapter-title" placeholder="Type title here and click add"></textarea>' +
      '<button class="btn-markdown-edit" id="chapter-add">Start editing chapter</button>' +
      '</div>');
    $('#new-chapter-title').on('input', function () {
        $(this).textareaAutoSize();
        chapterTitle = $(this).val();
      });
    $('#chapter-add').on('click', function () {
      if (chapterTitle.length < 4) {
        alert("This is not a valid file title");
        return true;
      } else {
        loadT6Creator (collectionId, data.description.releaseDate, 'compendium_chapter', pageUrl, chapterTitle)
      }
    });
  });

  function sortableSections() {
    $("#sortable-chapter").sortable();
  }
  sortableSections();

  // Edit data reference table
  // Load table to edit
  if (!data.datasets || data.datasets.length === 0) {
    lastIndexDataset = 0;
  } else {
    $(data.datasets).each(function(index, table) {
      $("#data-edit_"+index).click(function() {
        //open document
        var selectedData = $("#data-title_"+index).attr('data-url');
        refreshPreview(selectedData);
        viewWorkspace(selectedData, collectionId, 'edit');
      });

      // Delete
      $("#data-delete_"+index).click(function() {
        var result = confirm("You are going to delete the chapter this link refers to. Are you sure you want to proceed?");
        if (result === true) {
          var selectedData = $("#data-title_"+index).attr('data-url');
          var path = data.uri;
          $("#"+index).remove();
          data.datasets.splice(index, 1);
          postContent(collectionId, path, JSON.stringify(data),
            success = function (response) {
              //console.log("Updating completed " + response);
              Florence.Editor.isDirty = false;
              deleteContent(collectionId, selectedData, function() {
                refreshPreview(path);
                loadPageDataIntoEditor(path, collectionId);
              }, error);
            },
            error = function (response) {
              if (response.status === 400) {
                alert("Cannot edit this file. It is already part of another collection.");
              }
              else if (response.status === 401) {
                alert("You are not authorised to update content.");
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

  //Add new table (only one per compendium)
  if (!data.datasets || data.datasets.length === 0) {
    $("#add-data").one('click', function () {
      var tableTitle;
      $('#sortable-data').append(
        '<div id="' + lastIndexDataset + '" class="edit-section__sortable-item">' +
        '<textarea class="auto-size" id="new-data-title" placeholder="Type title here and click add"></textarea>' +
        '<button class="btn-markdown-edit" id="data-add">Start editing data</button>' +
        '</div>');
      $('#new-data-title').on('input', function () {
          $(this).textareaAutoSize();
          tableTitle = $(this).val();
        });
      $('#data-add').on('click', function () {
        if (tableTitle.length < 4) {
          alert("This is not a valid file title");
          return true;
        } else {
          loadT6Creator (collectionId, data.description.releaseDate, 'compendium_data', pageUrl, tableTitle)
        }
      });
    });
  } else {
    $('#add-data').hide().one('click', function () {
      alert('At the moment you can have one section here.')
    });
  }

  editRelated (collectionId, data, 'relatedMethodology', 'methodology');

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
    $(orderRelatedChapter).each(function(indexC, nameC){
      var uri = data.chapters[parseInt(nameC)].uri;
      newChapters[indexC] = {uri: uri};
    });
    data.chapters = newChapters;
    // Related methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function(indexM, nameM){
      var uri = $('#methodology-uri_'+nameM).val();
      uriChecked = checkRelatedPath(uri);
      newRelatedMethodology[indexM] = {uri: uriChecked};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

