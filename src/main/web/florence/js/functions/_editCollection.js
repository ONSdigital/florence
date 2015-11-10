function editCollection (collection) {
  var collDetails = $('.section-content').detach();
  var html = templates.collectionEdit(collection);
  $('.section-head').after(html);
  $('.collection-selected .btn-collection-edit').off();

  $('#collection-editor-name').on('input', function () {
    collection.name = $('#collection-editor-name').val();
  });

  if (!collection.publishDate) {
    $('#collection-editor-date').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      collection.publishDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
    });
  } else {
    dateTmp = collection.publishDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#collection-editor-date').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      collection.publishDate = new Date($('#collection-editor-date').datepicker('getDate')).toISOString();
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
  //

  //Save
  $('.btn-collection-editor-save').click(function () {
    sweetAlert("Work in progress", "Please, be patient.");
    //to be done
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

