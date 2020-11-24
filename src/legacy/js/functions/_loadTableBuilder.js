function loadTableBuilderV2(pageData, onSave, table) {
  const pageUrl = pageData.uri;
  const html = templates.tableBuilderV2(table);

  $('body').append(html);

  // onSave function - sends content to zebedee, adds the table to the parent page and closes the modal
  var saveTableV2 = function (tableJson) {
    if (!tableJson) {
      sweetAlert("Empty Table", "The table is empty - please select cancel instead.");
      return;
    }
    if (!tableJson.filename) {
      tableJson.filename = StringUtils.randomId();
    }
    if (!tableJson.uri) {
      tableJson.uri = pageUrl + "/" + tableJson.filename;
    }

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + tableJson.uri + ".json&validateJson=false",
      type: 'POST',
      data: JSON.stringify(tableJson),
      processData: false,
      contentType: 'application/json'
    });
    addTableToPageJson(tableJson);
    if (onSave) {
      onSave(tableJson.filename, '<ons-table-v2 path="' + tableJson.uri + '" />');
    }
    closeModal();
  };

  // adds the table to the parent page
  function addTableToPageJson(tableJson) {
    if (!pageData.tables) {
      pageData.tables = [];
    } else {

      var existingTable = _.find(pageData.tables, function (existingTable) {
        return existingTable.filename === tableJson.filename;
      });

      if (existingTable) {
        existingTable.title = tableJson.title;
        return;
      }
    }

    pageData.tables.push({title: tableJson.title, filename: tableJson.filename, uri: tableJson.uri, version: "2"});
  }

  function onError(message) {
    sweetAlert(message);
  }

  function closeModal() {
    closeTableBuilder("table-builder-app", onError)
    $('.table-builder').stop().fadeOut(200).remove();
  }

  if (table && table.filename) {
    jqxhr = $.getJSON("/zebedee/content/" + Florence.collection.id + "?uri=" + pageUrl + "/" + table.filename + ".json");
    jqxhr.done(function(data) {
        startTableBuilder("table-builder-app", data, saveTableV2, closeModal, onError, '/table');
    });
  } else {
      startTableBuilder("table-builder-app", {}, saveTableV2, closeModal, onError, '/table');
  }

}