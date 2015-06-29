function staticPageEditor(collectionId, data) {

  var newSections = [];
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

 // Edit content
  // Load and edition
  $(data.sections).each(function(index, note) {

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = {
        "title": $('#section-uri_' + index).val(),
        "markdown": $("#section-summary_" + index).val()
      };

       var saveContent = function(updatedContent) {
         data.sections[index].summary = updatedContent;
         data.sections[index].uri = $('#section-uri_' + index).val();
         updateContent(collectionId, getPathName(), JSON.stringify(data));
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#content-delete_"+index).click(function() {
      $("#"+index).remove();
//      delete the content on the page that is linked?
//      get the path before splicing
//      deleteContent(collectionId, path, function() {
//        refreshPreview(path);
//        loadPageDataIntoEditor(path, collectionName);
//      }, error);
//      console.log('File deleted');
      data.content.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new content
  $("#addContent").one('click', function () {
    data.sections.push({uri:"", summary:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableContent() {
    $("#sortable-sections").sortable();
  }
  sortableContent();

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
     // Sections
       var orderSection = $("#sortable-sections").sortable('toArray');
       $(orderSection).each(function (indexS, nameS) {
         var summary = data.sections[parseInt(nameS)].summary;
         var uri = $('#section-title_' + nameS).val();
         newSections[indexS] = {uri: uri, summary: summary};
       });
       data.sections = newSections;
  }
}

