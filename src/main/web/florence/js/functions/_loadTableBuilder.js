function loadTableBuilder(pageData, onSave, table) {

  var tableExists = table;
  var pageUrl = pageData.uri;
  var html = templates.tableBuilder(table);
  var previewTable;

  $('body').append(html);

  if (table) {
    renderTable(table.uri);
  }

  $('#upload-table-form').submit(function (event) {
    var formData = new FormData($(this)[0]);
    previewTable = buildJsonObjectFromForm(previewTable);
    var path = previewTable.uri;
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
      success: function () {
        createTableHtml();
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
    var iframeMarkup = '<iframe id="preview-frame" frameBorder ="0" scrolling = "yes" src="' + path + '"></iframe>';
    console.log(iframeMarkup);
    $('#preview-table').html(iframeMarkup);
  }

  $('.btn-table-builder-cancel').on('click', function () {

    $('.table-builder').stop().fadeOut(200).remove();

    // delete the preview table
    if (previewTable) {
      previewTable.files.push({"type": "json", "filename": previewTable.filename + '.json'});
      $(previewTable.files).each(function (index, file) {
        var fileToDelete = pageUrl + '/' + file.filename;
        deleteContent(Florence.collection.id, fileToDelete,
          onSuccess = function () {
            console.log("deleted table file: " + fileToDelete);
          });
      });
    }
  });

  function saveTableJson() {

    previewTable = buildJsonObjectFromForm(previewTable);
    var tableJson = previewTable.uri + ".json";

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson,
      type: 'POST',
      data: JSON.stringify(previewTable),
      processData: false,
      contentType: 'application/json',
      success: function () {
      }
    });
  }

  function addTableToPageJson(table) {
    if (!pageData.tables) {
      pageData.tables = []
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === table.filename;
      });

      if (existingTable) {
        existingTable.title = table.title;
        return;
      }
    }

    pageData.tables.push({title: table.title, filename: table.filename, uri: table.uri});
  }

  $('.btn-table-builder-create').on('click', function () {

    // if uploaded = true rename the preview table

    saveTableJson(); // save the latest json

    // if a table exists, rename the preview to its name
    if (tableExists) {
      previewTable.files.push({"type": "json", "filename": previewTable.filename + '.json'});
      $(previewTable.files).each(function (index, file) {

        var fromFile = pageUrl + '/' + file.filename;
        var toFile = pageUrl + '/' + file.filename.replace(previewTable.filename, table.filename);
        console.log("moving... table file: " + fromFile + " to: " + toFile);
        moveContent(Florence.collection.id, fromFile, toFile,
          onSuccess = function () {
            console.log("Moved table file: " + fromFile + " to: " + toFile);
          });
      });
    } else { // just keep the preview files
      table = previewTable;
      addTableToPageJson(table);
    }


    if (onSave) {
      onSave(table.filename, '<ons-table path="' + table.uri + '" />');
    }
    $('.table-builder').stop().fadeOut(200).remove();

  });

  function buildJsonObjectFromForm(table) {
    if (!table) {
      table = {};
    }

    table.type = 'table';
    table.title = $('#table-title').val();
    table.filename = table.filename ? table.filename : StringUtils.randomId();

    table.uri = pageUrl + "/" + table.filename;

    if (table.title === '') {
      table.title = '[Title]';
    }

    table.files = [];
    table.files.push({type: 'download-xls', filename: table.filename + '.xls'});
    table.files.push({type: 'html', filename: table.filename + '.html'});

    return table;
  }
}

