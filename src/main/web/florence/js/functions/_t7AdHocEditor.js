function adHocEditor(collectionId, data) {

  var newSections = [], newFiles = [];
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);

  $("#metadata-s").remove();
  $("#metadata-f").remove();
  $("#metadata-q").remove();
  $("#summary-p").remove();
  $("#contact-p").remove();
  $("#survey-p").remove();
  $("#frequency-p").remove();
  $("#compilation-p").remove();
  $("#geoCoverage-p").remove();
  $("#sampleSize-p").remove();
  $("#lastRevised-p").remove();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
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
  $("#reference").on('input', function () {
    $(this).textareaAutoSize();
    data.description.reference = $(this).val();
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

  editMarkdownWithNoTitle (collectionId, data, 'markdown', 'content');

  addFile (collectionId, data, 'downloads', 'file');

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
      newSections[indexS] = markdown;
      });
      data.markdown = newSections;
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function(index, name){
      var title = $('#file-title_'+name).val();
      var file = $('#file-filename_' + name).val();
      newFiles[index] = {title: title, uri: file};
    });
    data.downloads = newFiles;
  }
}

