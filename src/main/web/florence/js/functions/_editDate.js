function editDate (collectionId, data, field, idField) {
	var list = data[field];
	var dataTemplate = {list: list, idField: idField};
	var html = templates.editorDate(dataTemplate);
	$('#'+ idField).replaceWith(html);
	initialiseNoteMarkdown(collectionId, data, field, idField)
  runDatePicker();
}

function runDatePicker() {
  var countSections = $('.dateChange').length
  var i = 0;
  while (i < countSections) {
    $('#previousDate_' + i).datepicker({dateFormat: 'dd MM yy'});
    i++;
  }
}

function refreshNoteMarkdown (collectionId, data, field, idField) {
	var list = data[field];
	var dataTemplate = {list: list, idField: idField};
	var html = templates.editorDate(dataTemplate);
	$('#sortable-'+ idField).replaceWith($(html).find('#sortable-'+ idField));
	initialiseNoteMarkdown(collectionId, data, field, idField)
}

function initialiseNoteMarkdown(collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-note_'+index).click(function() {
      console.log(idField);
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
      //console.log('editedSectionValue = ' + editedSectionValue);

      var saveContent = function(updatedContent) {
        data[field][index].markdown = updatedContent;
        //console.log('updatedContent = ' + updatedContent)
        data[field][index].previousDate = $('#' + 'previousDate_' + index).val();
        saveNoteMarkdown (collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
        runDatePicker();
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      var result = confirm("Are you sure you want to delete?");
      if (result === true) {
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position + 300;
        $(this).parent().remove();
        data[field].splice(index, 1);
        saveNoteMarkdown(collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      }
    });
  });

  //Add
  $('#add-' + idField).off().one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 300;
    data[field].push({markdown:"", previousDate:""});
    saveNoteMarkdown(collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

function saveNoteMarkdown (collectionId, path, data, field, idField) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            refreshNoteMarkdown (collectionId, data, field, idField);
            refreshChartList(data, collectionId);
            refreshTablesList(data, collectionId);
            runDatePicker();
        },
        error = function (response) {
            if (response.status === 400) {
                alert("Cannot edit this page. It is already part of another collection.");
            }
            else if (response.status === 401) {
                alert("You are not authorised to update content.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}