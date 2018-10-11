function staticLandingPageEditor(collectionId, data) {

  var newSections = [], newLinks = [];
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


  // Metadata edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
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

  // Edit content
  // Load and edition
  $(data.sections).each(function (index) {

    $('#section-uri_' + index).on('paste', function () {
      setTimeout(function () {
        var pastedUrl = $('#section-uri_' + index).val();
        var safeUrl = checkPathParsed(pastedUrl);
        $('#section-uri_' + index).val(safeUrl);
      }, 50);
    });

    if (!$('#section-uri_' + index).val()) {
      $('<button class="btn-edit-save-and-submit-for-review" id="section-get_' + index + '">Go to</button>').insertAfter('#section-uri_' + index);

      $('#section-get_' + index).click(function () {
        var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
        createWorkspace(data.uri, collectionId, '', null, true);
        $('#section-get_' + index).html('Copy link').off().one('click', function () {
          var uriCheck = getPathNameTrimLast();
          var uriChecked = checkPathSlashes(uriCheck);
          data.sections[index].uri = uriChecked;
          putContent(collectionId, data.uri, JSON.stringify(data),
            success = function (response) {
              console.log("Updating completed " + response);
              Florence.Editor.isDirty = false;
              viewWorkspace(data.uri, collectionId, 'edit');
              refreshPreview(data.uri);
              var iframeEvent = document.getElementById('iframe').contentWindow;
              iframeEvent.addEventListener('click', Florence.Handler, true);
            },
            error = function (response) {
              if (response.status === 400) {
                  sweetAlert("Cannot edit this page", "It is already part of another collection.");
              }
              else {
                handleApiError(response);
              }
            }
          );
        });
      });
    }

    $("#section-edit_" + index).click(function () {
      var editedSectionValue = {
        "title": $('#section-title_' + index).val(),
        "markdown": $("#section-markdown_" + index).val()
      };

      var saveContent = function (updatedContent) {
        data.sections[index].summary = updatedContent;
        data.sections[index].title = $('#section-title_' + index).val();
        data.sections[index].uri = $('#section-uri_' + index).val();
        updateContent(collectionId, data.uri, JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#section-delete_" + index).click(function () {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result) {
        if (result === true) {
          $("#" + index).remove();
          data.sections.splice(index, 1);
          updateContent(collectionId, data.uri, JSON.stringify(data));
          swal({
            title: "Deleted",
            text: "This section has been deleted",
            type: "success",
            timer: 2000
          });
        }
      });
    });

      // Tooltips
    $(function () {
      $('#section-uri_' + index).tooltip({
        items: '#section-uri_' + index,
        content: 'Copy link or click Go to, navigate to page and click Copy link. Then add a title and click Edit',
        show: "slideDown", // show immediately
        open: function (event, ui) {
          ui.tooltip.hover(
            function () {
              $(this).fadeTo("slow", 0.5);
            });
        }
      });
    });

    $(function () {
      $('#section-title_' + index).tooltip({
        items: '#section-title_' + index,
        content: 'Type a title and click Edit',
        show: "slideDown", // show immediately
        open: function (event, ui) {
          ui.tooltip.hover(
            function () {
              $(this).fadeTo("slow", 0.5);
            });
        }
      });
    });
  });

  //Add new content
  $("#add-section").one('click', function () {
    swal ({
      title: "Warning",
      text: "If you do not come back to this page, you will lose any unsaved changes",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel"
    }, function(result) {
      if (result === true) {
        data.sections.push({uri: "", title: "", summary: ""});
        updateContent(collectionId, data.uri, JSON.stringify(data));
      } else {
        loadPageDataIntoEditor(data.uri, collectionId);
      }
    });
  });

  function sortableContent() {
    $("#sortable-section").sortable();
  }

  sortableContent();

  renderExternalLinkAccordionSection(collectionId, data, 'links', 'link');

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

    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var summary = data.sections[parseInt(nameS)].summary;
        // Fixes title or uri not saving unless markdown edited
        var title = $('#section-title_' + nameS).val();
        var uri = $('#section-uri_' + nameS).val();
      //var title = data.sections[parseInt(nameS)].title;
      //var uri = data.sections[parseInt(nameS)].uri;
      var uriChecked = checkPathSlashes(uri);
      newSections[indexS] = {uri: uriChecked, title: title, summary: summary};
    });
    data.sections = newSections;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function (indexL, nameL) {
      var displayText = data.links[parseInt(nameL)].title;
      var link = $('#link-uri_' + nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}
