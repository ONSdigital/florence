function initialiseLastNoteMarkdown(collectionId, data, field) {
  // Load
  var lastIndex = data[field].length - 1;
  var editedSectionValue = '';
  var saveContent = function (updatedContent) {
    data[field][lastIndex].changeNotice = updatedContent;

    postContent(collectionId, data.uri, JSON.stringify(data),
      success = function () {
        Florence.Editor.isDirty = false;
        loadPageDataIntoEditor(data.uri, collectionId);
        refreshPreview(data.uri);
      },
      error = function (response) {
        if (response.status === 400) {
          alert("Cannot edit this page. It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  };
  loadMarkdownEditor(editedSectionValue, saveContent, data);

}
