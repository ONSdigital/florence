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
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.keywords = $(this).val();
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.metaDescription = $(this).val();
  });

  //Edit section
  $(data.sections).each(function(index, section) {
//  lastIndexSections = index + 1;
    $("#section-edit_"+index).click(function() {

      var pageurl = localStorage.getItem('pageurl');
      localStorage.setItem('historicUrl', pageurl);
      var reload = (localStorage.getItem("historicUrl") === "/") ? "" : localStorage.getItem("historicUrl");
      var iframeEvent = document.getElementById('iframe').contentWindow;
          iframeEvent.removeEventListener('click', Florence.Handler, true);

      $('#' + index).replaceWith(
          '<div id="' + index + '" class="edit-section__sortable-item">' +
          '  <textarea id="uri_' + index + '" placeholder="Go to the related document and click Get"></textarea>' +
          '  <button class="btn-page-get" id="section-get_' + index + '">Get</button>' +
          '  <button class="btn-page-cancel" id="section-cancel_' + index + '">Cancel</button>' +
          '</div>');
      $("#section-cancel_" + index).hide();

      $("#section-get_" + index).one('click', function () {
        $("#section-cancel_" + index).show().one('click', function () {
          $('#section-cancel_' + index).hide();
          $('#' + index).hide();
          refreshPreview(localStorage.getItem("historicUrl"));
          loadPageDataIntoEditor(localStorage.getItem("historicUrl"), collectionId);
          localStorage.removeItem('historicUrl');
        });

        var sectionUrl = $('#iframe')[0].contentWindow.document.location.href;
        var sectionUrlData = "/data" + sectionUrl.split("#!")[1];

        $.ajax({
          url: sectionUrlData,
          dataType: 'json',
          crossDomain: true,
          success: function (sectionData) {
            if (sectionData.type === 'timeseries') {
              data.sections.splice(index, 1,
              {name: sectionData.breadcrumb[0].name,
              link: sectionData.breadcrumb[0].fileName,
              items: [{
                name: sectionData.name,
                uri: sectionData.uri
              }]
              });
              postContent(collectionId, reload, JSON.stringify(data),
                success = function (response) {
                  console.log("Updating completed " + response);
                  Florence.Editor.isDirty = false;
                  loadPageDataIntoEditor(localStorage.getItem("historicUrl"), collectionId);
                  refreshPreview(localStorage.getItem("historicUrl"));
                  iframeEvent.addEventListener('click', Florence.Handler, true);
                  localStorage.removeItem('historicUrl');
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
              alert("This is not an article or a bulletin");
            }
          },
          error: function () {
            console.log('No page data returned');
          }
        });
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
      var uri = data.sections[parseInt(nameS)].items[0].uri;
      var name = data.sections[parseInt(nameS)].items[0].name;
      var link = data.sections[parseInt(nameS)].link;
      var linkName = data.sections[parseInt(nameS)].name;
      newSections[parseInt(indexS)] = {name: linkName,
                                     link: link,
                                     items: [{
                                       name: name,
                                       uri: uri
                                       }]
                                     };
    });
    data.sections = newSections;
  }
}

