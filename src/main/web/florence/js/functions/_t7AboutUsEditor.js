function aboutUsEditor(collectionId, data) {

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

  $("#metadata-q").remove();
  $("#metadata-f").remove();
  $("#metadata-ad").remove();
  $("#contact-p").remove();
  $("#survey-p").remove();
  $("#metadata-b").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $("#lastRevised-p").remove();
  $("#releaseDate-p").remove();
  $("#reference-p").remove();
  $("#download").remove();

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
  $(data.content).each(function(index, note) {

    $("#content-edit_"+index).click(function() {
      var editedSectionValue = $("#content-markdown_" + index).val();

      var saveContent = function(updatedContent) {
        data.content[index].markdown = updatedContent;
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#content-delete_"+index).click(function() {
      $("#"+index).remove();
      data.content.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new content
  $("#addContent").one('click', function () {
    data.content.push({data:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableContent() {
    $("#sortable-content").sortable();
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
      var orderSection = $("#sortable-content").sortable('toArray');
      $(orderSection).each(function (indexS, nameS) {
        var markdown = $('#content-markdown_' + nameS).val();
      newSections[indexS] = {markdown: markdown};
      });
      data.content = newSections;
  }
}

