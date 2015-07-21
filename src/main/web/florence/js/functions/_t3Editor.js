function t3Editor(collectionId, data) {

  var newTimeseries = [], newBulletins = [], newArticles = [], newDatasets = [];
  var lastIndexTimeseries;
  var setActiveTab, getActiveTab;

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

    $(data.items).each(function(index, section) {
        lastIndexTimeseries = index + 1;
        // Delete
        $("#timeseries-delete_"+index).click(function() {
          var result = confirm("Are you sure you want to delete?");
          if (result === true) {
            $("#" + index).remove();
            data.items.splice(index, 1);
            updateContent(collectionId, data.uri, JSON.stringify(data));
          }
        });
    });

    //Add new related timeseries
    $("#add-timeseries").one('click', function () {
        var position = $(".workspace-edit").scrollTop();
        localStorage.setItem("pagePos", position);
        var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
        createWorkspace(data.uri, collectionId, '', true);

        $('#sortable-timeseries').append(
            '<div id="' + lastIndexTimeseries + '" class="edit-section__sortable-item">' +
            '  <textarea id="timeseries-uri_' + lastIndexTimeseries + '" placeholder="Go to the related timeseries and click Get"></textarea>' +
            '  <button class="btn-page-get" id="timeseries-get_' + lastIndexTimeseries + '">Get</button>' +
            '  <button class="btn-page-cancel" id="timeseries-cancel_' + lastIndexTimeseries + '">Cancel</button>' +
            '</div>').trigger('create');

        $("#timeseries-get_" + lastIndexTimeseries).one('click', function () {
            var pastedUrl = $('#timeseries-uri_'+lastIndexTimeseries).val();
            if (pastedUrl) {
                checkPathParsed(pastedUrl);
                var timeseriesUrlData = pastedUrl + "/data";
            } else {
                var timeseriesUrl = getPathNameTrimLast();
                checkPathParsed(timeseriesUrl);
                var timeseriesUrlData = timeseriesUrl + "/data";
            }

            $.ajax({
                url: timeseriesUrlData,
                dataType: 'json',
                crossDomain: true,
                success: function (relatedData) {
                    if (relatedData.type === 'timeseries') {
                        if (!data.items) {
                            data.items = [];
                        }
                        data.items.push({uri: relatedData.uri});
                        postContent(collectionId, data.uri, JSON.stringify(data),
                            success = function (response) {
                                Florence.Editor.isDirty = false;
                                createWorkspace(data.uri, collectionId, 'edit');
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
                        alert("This is not a timeseries");
                    }
                },
                error: function () {
                    console.log('No page data returned');
                }
            });
        });

        $("#timeseries-cancel_" + lastIndexTimeseries).one('click', function () {
            createWorkspace(data.uri, collectionId, 'edit');
        });
    });

    function sortableTimeseries() {
        $("#sortable-timeseries").sortable();
    }
    sortableTimeseries();

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
    // Timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, titleT) {
      var uri = data.items[parseInt(titleT)].uri;
      checkPathSlashes(uri);
      newTimeseries[indexT] = {uri: uri};
    });
    data.items = newTimeseries;
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, titleB) {
      var uri = data.statsBulletins[parseInt(titleB)].uri;
      checkPathSlashes (uri);
      newBulletins[indexB] = {uri: uri};
    });
    data.statsBulletins = newBulletins;
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, titleA) {
      var uri = data.relatedArticles[parseInt(titleA)].uri;
      checkPathSlashes (uri);
      newArticles[indexA] = {uri: uri};
    });
    data.relatedArticles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, titleD) {
      var uri = data.datasets[parseInt(titleD)].uri;
      checkPathSlashes (uri);
      newDatasets[indexD] = {uri: uri};
    });
    data.datasets = newDatasets;
  }
}

