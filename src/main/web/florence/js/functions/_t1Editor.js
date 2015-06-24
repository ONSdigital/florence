function t1Editor(collectionId, data) {

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
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.keywords = $(this).val();
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });

  //Edit section
  $(data.sections).each(function(index, section) {
//  lastIndexSections = index + 1;
    $("#section-edit_"+index).click(function() {

      var iframeEvent = document.getElementById('iframe').contentWindow;
          iframeEvent.removeEventListener('click', Florence.Handler, true);
      createWorkspace('/', collectionId, '', true);

      $('#' + index).replaceWith(
          '<div id="' + index + '" class="edit-section__sortable-item">' +
          '  <textarea id="uri_' + index + '" placeholder="Go to the related document and click Get"></textarea>' +
          '  <button class="btn-page-get" id="section-get_' + index + '">Get</button>' +
          '  <button class="btn-page-cancel" id="section-cancel_' + index + '">Cancel</button>' +
          '</div>');
      $("#section-cancel_" + index).hide();

      $("#section-get_" + index).one('click', function () {

        var sectionUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var sectionUrlData = sectionUrl + "/data";

        $.ajax({
          url: sectionUrlData,
          dataType: 'json',
          crossDomain: true,
          success: function (sectionData) {
            if (sectionData.type === 'timeseries') {
              data.sections.splice(index, 1,
              {theme: {uri: sectionData.breadcrumb[1].uri},
               statistics: {uri: sectionData.uri}
              });
              postContent(collectionId, '', JSON.stringify(data),
                success = function (response) {
                  console.log("Updating completed " + response);
                  Florence.Editor.isDirty = false;
                  createWorkspace('/', collectionId, 'edit');
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
            } else {
              alert("This is not a time series");
            }
          },
          error: function () {
            console.log('No page data returned');
          }
        });
      });

      $("#section-cancel_" + index).show().one('click', function () {
        createWorkspace(pageUrl, collectionId, 'edit');
      });
    });
  });

  function sortableSections() {
    $("#sortable-sections").sortable();
  }
  sortableSections();

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
  });

  // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      //pageData = $('.fl-editor__headline').val();
      saveData();
      saveAndCompleteContent(collectionId, getPathName(), JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      saveData()
      saveAndReviewContent(collectionId, getPathName(), JSON.stringify(data));
    });

  function save() {
    saveData();
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  }

  function saveData() {
    // sections
    var orderSections = $("#sortable-sections").sortable('toArray');
    $(orderSections).each(function(indexS, nameS){
      var uri = data.sections[parseInt(nameS)].statistics.data.uri;
      var link = data.sections[parseInt(nameS)].theme.uri;
      newSections[parseInt(indexS)] = {theme: {uri: link},
                                       statistics: {uri: uri}
                                      };
    });
    data.sections = newSections;
  }
}

