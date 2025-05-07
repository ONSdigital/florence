function importTsTitles(collectionId) {

    // open the modal
    var modal = templates.importTsTitlesModal;
    $('.wrapper').append(modal);

    // on save
    $('#import-ts-form').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var formdata = new FormData();

        var file = this[0].files[0];
        if (!file) {
            sweetAlert("Please select a file to upload");
            return;
        }

        var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
        var uriUpload = "/" + fileNameNoSpace;

        if (file.name.match(".csv")) {
            if (formdata) {
                formdata.append("name", file);
            }
        } else {
            sweetAlert("This file type is not supported");
            return;
        }

        if (formdata) {
            $.ajax({
                url: `${API_PROXY.VERSIONED_PATH}/timeseriesimport/${collectionId}?uri=${uriUpload},
                type: 'POST',
                data: formdata,
                cache: false,
                processData: false,
                contentType: false,
                success: function () {
                    $('.modal').remove();
                }
            });
        }
    });

    // cancel button
    $('.btn-modal-cancel').off().click(function () {
        $('.modal').remove();
    });

}
