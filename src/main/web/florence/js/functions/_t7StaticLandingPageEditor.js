function staticLandingPageEditor(collectionId, data) {

  var newSections = [], newLinks = [];
  var setActiveTab, getActiveTab;
  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);


  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
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
  $(data.sections).each(function(index) {

    $('#section-uri_'+index).on('paste', function() {
      setTimeout(function () {
      var pastedUrl = $('#section-uri_'+index).val();
        checkPathParsed(pastedUrl);
        $('#section-uri_'+index).val(pastedUrl);
      }, 50);
    });

    if (!$('#section-uri_'+index).val()) {
      $('<button class="btn-edit-save-and-submit-for-review" id="section-get_' + index + '">Get</button>').insertAfter('#section-uri_'+index);
    }
    $('#section-get_'+index).click(function() {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Florence.Handler, true);
      createWorkspace(data.uri, collectionId, '', true);
      $('#section-get_'+index).html('Paste').off().one('click', function() {
        uriChecked = getPathNameTrimLast();
        checkPathParsed(uriChecked);
        data.sections[index].uri = uriChecked;
        saveRelated(collectionId, data.uri, data);
      });
    });

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = {
        "title": $('#section-uri_' + index).val(),
        "markdown": $("#section-markdown_" + index).val()
      };

       var saveContent = function(updatedContent) {
         data.sections[index].summary = updatedContent;
         data.sections[index].uri = $('#section-uri_' + index).val();
         updateContent(collectionId, data.uri, JSON.stringify(data));
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#section-delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });
  });

  //Add new content
  $("#add-section").one('click', function () {
    data.sections.push({uri:"", summary:""});
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  function sortableContent() {
    $("#sortable-section").sortable();
  }
  sortableContent();

  editLink(collectionId, data, 'links', 'link');

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
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

  function save() {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var summary = data.sections[parseInt(nameS)].summary;
      var uri = $('#section-uri_' + nameS).val();
      uriChecked = checkPathParsed(uri);
      newSections[indexS] = {uri: uriChecked, summary: summary};
    });
    data.sections = newSections;
    // External links
    var orderLink = $("#sortable-link").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var displayText = $('#link-markdown_'+nameL).val();
      var link = $('#link-uri_'+nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
  }
}

