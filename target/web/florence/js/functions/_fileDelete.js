function fileDelete (collectionId, data, field, index) {
  swal ({
    title: "Warning",
    text: "Are you sure you want to delete this file?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    closeOnConfirm: false
  }, function(result) {
    if (result === true) {
      swal({
        title: "Deleted",
        text: "This alert has been deleted",
        type: "success",
        timer: 2000
      });
      var position = $(".workspace-edit").scrollTop();
      Florence.globalVars.pagePos = position;
      $(this).parent().remove();
      $.ajax({
        url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + '/' + data[field][index].file,
        type: "DELETE",
        success: function (res) {
          console.log(res);
        },
        error: function (res) {
          console.log(res);
        }
      });
      data[field].splice(index, 1);
      updateContent(collectionId, data.uri, JSON.stringify(data));
    }
  });
}

