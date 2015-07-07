function compendiumEditor(collectionId, data) {

//  var index = data.release;
  var newChapters = [], newDatasets = [], newRelatedMethodology = [];
  var lastIndexChapter, lastIndexDataset, lastIndexRelatedMethodology = 0;
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
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = $('#releaseDate').val();
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(dateTmpFormatted);
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
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
                        availableTags: data.description.keywords,
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
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
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
        var path = getPathName();
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
  $("#addChapter").one('click', function () {
    var pageTitle;
    $('#sortable-chapters').append(
      '<div id="' + lastIndexChapter + '" class="edit-section__sortable-item">' +
      '<textarea class="auto-size" id="new-chapter-title" placeholder="Type title here and click add"></textarea>' +
      '<button class="btn-markdown-edit" id="chapter-add">Start editing chapter</button>' +
      '</div>');
    $('#new-chapter-title').on('input', function () {
        $(this).textareaAutoSize();
        pageTitle = $(this).val();
      });
    $('#chapter-add').on('click', function () {
      if (pageTitle.length < 4) {
        alert("This is not a valid file title");
        return true;
      } else {
        loadT6Creator (collectionId, data.description.releaseDate, 'compendium_chapter', pageUrl, pageTitle)
      }
    });
  });

  function sortableSections() {
    $("#sortable-chapters").sortable();
  }
  sortableSections();

  // Edit accordion
  // Load and edition
  $(data.accordion).each(function(index, tab) {

    $("#tab-edit_"+index).click(function() {
      var editedSectionValue = {
        "title": $('#tab-title_' + index).val(),
        "markdown": $("#tab-markdown_" + index).val()
      };

      var saveContent = function(updatedContent) {
        data.accordion[index].markdown = updatedContent;
        data.accordion[index].title = $('#tab-title_' + index).val();
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#tab-delete_"+index).click(function() {
      $("#"+index).remove();
      data.accordion.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new tab
  $("#addTab").one('click', function () {
    data.accordion.push({title:"", markdown:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableTabs() {
    $("#sortable-tabs").sortable();
  }
  sortableTabs();

  //Add related methodology
  $("#addMethodology").one('click', function () {
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-methodology').append(
        '<div id="' + lastIndexRelatedMethodology + '" class="edit-section__sortable-item">' +
        '  <textarea id="methodology-uri_' + lastIndexRelatedMethodology + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="methodology-get_' + lastIndexRelatedMethodology + '">Get</button>' +
        '  <button class="btn-page-cancel" id="methodology-cancel_' + lastIndexRelatedMethodology + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#methodology-get_" + lastIndexRelatedMethodology).one('click', function () {
      pastedUrl = $('#methodology-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var relatedMethodologyUrlData = myUrl.pathname + "/data";
      } else {
        var relatedMethodologyUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var relatedMethodologyUrlData = relatedMethodologyUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: relatedMethodologyUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedMethodologyData) {
          if (relatedMethodologyData.type === 'methodology') {
            if (!data.relatedMethodology) {
              data.relatedMethodology = [];
            }
            data.relatedMethodology.push({uri: relatedMethodologyData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a methodology");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#methodology-cancel_" + lastIndexRelatedMethodology).one('click', function () {
     createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedMethodology() {
    $("#sortable-methodology").sortable();
  }
  sortableRelatedMethodology();

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      //pageData = $('.fl-editor__headline').val();
      save();
      saveAndCompleteContent(collectionId, getPathName(), JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      save()
      saveAndReviewContent(collectionId, getPathName(), JSON.stringify(data));
    });

  function save() {
    // Chapters
    var orderChapter = $("#sortable-chapters").sortable('toArray');
    $(orderChapter).each(function (indexC, nameC) {
      var uri = data.chapters[parseInt(nameC)].uri;
      newChapters[indexC] = {uri: uri};
    });
    data.chapters = newChapters;
    // Dataset
    // Related methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function(indexM, nameM){
      var uri = $('#methodology-uri_'+nameM).val();
      newRelatedMethodology[parseInt(indexM)] = {uri: uri};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

