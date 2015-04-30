function saveRelated (collectionName, path, content) {
  var iframeEvent = document.getElementById('iframe').contentWindow;
  postContent(collectionName, path, JSON.stringify(content),
    success = function (response) {
      console.log("Updating completed " + response);
      Florence.Editor.isDirty = false;
      loadPageDataIntoEditor(path, collectionName);
      refreshPreview(path);
      iframeEvent.addEventListener('click', Florence.Handler, true);
      localStorage.removeItem('historicUrl');
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
}