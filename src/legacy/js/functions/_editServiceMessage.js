function editServiceMessage(collectionId, data) {
  if (!data.serviceMessage) {
    data.serviceMessage = '';
  }
  //add template to editor
  var text = data.serviceMessage;
  var html = templates.editorServiceMessage(text);
  $('#srv-msg').replaceWith(html);
  //change text
  $("#srv-msg-txt").on('input', function () {
    $(this).textareaAutoSize();
    data.serviceMessage = $(this).val();
  });

  //delete
  $('#srv-msg-delete').click(function () {
    swal({
      title: "Warning",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: true
    }, function (result) {
      if (result === true) {
        data.serviceMessage = "";
        putContent(collectionId, '', JSON.stringify(data),
          success = function () {
            Florence.Editor.isDirty = false;
            createWorkspace('/', collectionId, 'edit');
          },
          error = function (response) {
            if (response.status === 400) {
              sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
    });
  });
}