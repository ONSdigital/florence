function editCollection (collection) {

  var editPublishTime, newCollectionDate, toIsoDate;
  var collDetails = $('.section-content').detach();
  var html = templates.collectionEdit(collection);
  $('.section-head').after(html);
  $('.collection-selected .btn-collection-edit').off();

  $('#collection-editor-name').on('input', function () {
    collection.name = $('#collection-editor-name').val();
  });

  if (!collection.publishDate) {
    $('#collection-editor-date').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      toIsoDate = $('#collection-editor-date').datepicker("getDate");
    });
  } else {
    dateTmp = collection.publishDate;
    toIsoDate = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#collection-editor-date').val(toIsoDate).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      toIsoDate = $('#collection-editor-date').datepicker("getDate");
    });
  }

  //initial value
  if (collection.type === "manual") {
    $('#collection-editor-date-block').hide();
  } else {
    $('#collection-editor-date-block').show();
  }

  $('input[type=radio]').click(function () {
    if ($(this).val() === 'manualCollection') {
      collection.type = "manual";
      $('#collection-editor-date-block').hide();
    } else if ($(this).val() === 'scheduledCollection') {
      collection.type = "scheduled";
      $('#collection-editor-date-block').show();
    }
  });

  //More functionality to be added here
  // When scheduled, do we change all the dates in the files in the collection?


  //Save
  $('.btn-collection-editor-save').click(function () {
    //save date and time to collection
    if (collection.type === 'scheduled') {
      editPublishTime = parseInt($('#collection-editor-hour').val()) + parseInt($('#collection-editor-min').val());
      collection.publishDate = new Date(parseInt(new Date(toIsoDate).getTime()) + editPublishTime).toISOString();
    } else {}
    //check validity
    if (collection.name === '') {
      sweetAlert('This is not a valid collection name', "A collection name can't be empty");
      return true;
    } if (collection.name.match(/\./)) {
      sweetAlert('This is not a valid collection name', "You can't use fullstops");
      return true;
    } if ((collection.type === 'scheduled') && (Date.parse(collection.publishDate) < new Date())) {
      sweetAlert('This is not a valid date. Date cannot be in the past');
      return true;
    } else {
      // Update the collection
      $.ajax({
        url: "/zebedee/collection/" + collection.id,
        dataType: 'json',
        contentType: 'application/json',
        type: 'PUT',
        data: JSON.stringify(collection),
        success: function (updatedCollection) {
          Florence.setActiveCollection(updatedCollection);
          createWorkspace('', updatedCollection.id, 'browse');
        },
        error: function (response) {
          if(response.status === 409) {
            sweetAlert("Error", response.responseJSON.message, "error");
          }
          else {
            handleApiError(response);
          }
        }
      });
    }
  });

  //Cancel
  $('.btn-collection-editor-cancel').click(function () {
    $('.collection-selected .btn-collection-edit').click(function () {
      editCollection(collection);
    });
    $('.collection-editor').remove();
    $('.section-head').after(collDetails);
  });

  setCollectionEditorHeight();
}

  function setCollectionEditorHeight(){
    var panelHeight = parseInt($('.collection-selected').height());

    var headHeight = parseInt($('.section-head').height());
    var headPadding = parseInt($('.section-head').css('padding-bottom'));

    var contentHeight = panelHeight - (headHeight + headPadding);
    $('.collection-editor__editor').css('height', contentHeight);
  }

