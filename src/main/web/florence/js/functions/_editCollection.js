function editCollection (collection) {
  var collDetails = $('.section-content').detach();
  var html = templates.collectionEdit(collection);
  $('.section-head').after(html);

  console.log(collection);

  //functionality to be added here
  $('#collection-editor-name').on('input', function () {
    collection.name = $('#collection-editor-name').val();
    console.log(collection);
  });

  if (!collection.publishDate) {
    $('#collection-editor-date').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      collection.publishDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      console.log(collection);
    });
  } else {
    dateTmp = collection.publishDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#collection-editor-date').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      collection.publishDate = new Date($('#collection-editor-date').datepicker('getDate')).toISOString();
      console.log(collection);
    });
  }


  //Save
  $('.btn-collection-editor-save').click(function () {
    alert("Work in progress! Be patient");
    //to be done
  });

  //Cancel
  $('.btn-collection-editor-cancel').click(function () {
    $('.collection-editor').remove();
    $('.section-head').after(collDetails);
  });
}

