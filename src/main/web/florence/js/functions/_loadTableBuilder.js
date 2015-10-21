function loadTableBuilder(pageData, onSave, table) {

  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var uploadedNotSaved = {uploaded: false, saved: false, table: ""};
  $('body').append(html);

  if (table) {
    renderTable(table.uri);
  }

  $('#upload-table-form').submit(function (event) {
    $(this).find(':submit').attr('disabled', 'disabled');
    event.preventDefault();

    var formData = new FormData($(this)[0]);
    var table = buildJsonObjectFromForm();
    var path = table.uri;
    var xlsPath = path + ".xls";
    var htmlPath = path + ".html";


    // send xls file to zebedee
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + xlsPath,
      type: 'POST',
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function (returndata) {
        createTableHtml();
        uploadedNotSaved.uploaded = true;
        uploadedNotSaved.table = path;
      }
    });

    function createTableHtml() {
      $.ajax({
        url: "/zebedee/table/" + Florence.collection.id + "?uri=" + xlsPath,
        type: 'POST',
        success: function (html) {
          saveTableJson();
          saveTableHtml(html);
        }
      });
    }

    function saveTableHtml(data) {
      $.ajax({
        url: "/zebedee/content/" + Florence.collection.id + "?uri=" + htmlPath,
        type: 'POST',
        data: data,
        processData: false,
        success: function () {
          renderTable(path);
        }
      });
    }

    return false;
  });

  function renderTable(path) {
    var uri = path + "/table";
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + uri + '"></iframe>';
    console.log(iframeMarkup);
    $('#table').html(iframeMarkup);

    document.getElementById('preview-frame').height = "500px";
    document.getElementById('preview-frame').width = "100%";
  }

  $('.btn-table-builder-cancel').on('click', function () {
    $('.table-builder').stop().fadeOut(200).remove();
    if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
      // delete any files associated with the table.   //get the info from json
      //_(table.files).each(function (file) {
      //  var fileToDelete = path + '/' + file.filename;
      //  deleteContent(Florence.collection.id, fileToDelete,
      //    onSuccess = function () {
      //      console.log("deleted table file: " + fileToDelete)
      //    });
      //});
    }
  });

  function saveTableJson() {

    table = buildJsonObjectFromForm();
    var tableJson = table.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson,
      type: 'POST',
      data: JSON.stringify(table),
      processData: false,
      contentType: 'application/json',
      success: function (res) {
        addTableToPageJson(table);
        uploadedNotSaved.saved = true;
      }
    });
  }

  function addTableToPageJson(table) {
    if (!pageData.tables) {
      pageData.tables = []
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === table.filename
      });

      if (existingTable) {
        existingTable.title = table.title;
        return;
      }
    }

    pageData.tables.push({title: table.title, filename: table.filename, uri: table.uri});
  }

  $('.btn-table-builder-create').on('click', function () {

    saveTableJson();

    if (onSave) {
      onSave(table.filename, '<ons-table path="' + table.uri + '" />');
    }
    $('.table-builder').stop().fadeOut(200).remove();

  });

  function buildJsonObjectFromForm() {
    if (!table) {
      table = {};
    }

    table.type = 'table';
    table.title = $('#table-title').val();
    table.filename = table.filename ? table.filename : StringUtils.randomId();

    table.uri = pageUrl + "/" + table.filename;

    if (table.title === '') {
      table.title = '[Title]'
    }

    table.files = [];
    table.files.push({type: 'download-xls', filename: table.filename + '.xls'});
    table.files.push({type: 'html', filename: table.filename + '.html'});

    return table;
  }
}

