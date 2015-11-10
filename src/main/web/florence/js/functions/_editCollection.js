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
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#collection-editor-date').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      toIsoDate = $('#collection-editor-date').datepicker("getDate");
    });
  }

  //initial value
  if (collection.type === "manual") {
    $('.block').hide();
  } else {
    $('.block').show();
  }

  $('input[type=radio]').click(function () {
    if ($(this).val() === 'manualCollection') {
      collection.type = "manual";
      $('.block').hide();
    } else if ($(this).val() === 'scheduledCollection') {
      collection.type = "scheduled";
      $('.block').show();
    }
  });

  //More functionality to be added here
  // When scheduled, do we change all the dates in the files in the collection?


  //Save
  $('.btn-collection-editor-save').click(function () {
    //save date and time to collection
    sweetAlert("Work in progress", "Please, be patient.");
    editPublishTime  = parseInt($('#collection-editor-hour').val()) + parseInt($('#collection-editor-min').val());
    newCollectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + editPublishTime).toISOString();

    //to be done

    // inline tests

    //if (collectionId === '') {
    //  sweetAlert('This is not a valid collection name', "A collection name can't be empty");
    //  return true;
    //} if (collectionId.match(/\./)) {
    //  sweetAlert('This is not a valid collection name', "You can't use fullstops");
    //  return true;
    //} if ((publishType === 'scheduled') && (scheduleType === 'custom')  && (isValidDate(new Date(collectionDate)))) {
    //  sweetAlert('This is not a valid date');
    //  return true;
    //} if ((publishType === 'scheduled') && (scheduleType === 'custom') && (Date.parse(collectionDate) < new Date())) {
    //  sweetAlert('This is not a valid date');
    //  return true;
    //} else {
    //  // Create the collection
    //  $.ajax({
    //    url: "/zebedee/collection",
    //    dataType: 'json',
    //    contentType: 'application/json',
    //    type: 'POST',
    //    data: JSON.stringify({name: collectionId, type: publishType, publishDate: collectionDate, releaseUri: releaseUri}),
    //    success: function (collection) {
    //      Florence.setActiveCollection(collection);
    //      createWorkspace('', collection.id, 'browse');
    //    },
    //    error: function (response) {
    //      if(response.status === 409) {
    //        sweetAlert("Error", response.responseJSON.message, "error");
    //      }
    //      else {
    //        handleApiError(response);
    //      }
    //    }
    //  });
    //}
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

