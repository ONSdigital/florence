/**
 * Created by crispin on 10/12/2015.
 */
function loadEmbedIframe(onSave) {
    // add modal window
    $('.workspace-menu').append(templates.embedIframe());

    // variables
    var modal = $(".modal");

    // modal functions
    function closeModal() {
        modal.remove();
    }
    function saveUrl() {
        var embedUrl = $('input#embed-url').val();
        if (!embedUrl) {
            console.log("No url added");
            sweetAlert('URL field is empty', 'Please add a url and save again');
        } else {
            onSave('<ons-interactive url="' + embedUrl + '" />');
            modal.remove();
        }
    }

    // bind events
    $('.btn-embed-cancel').click(function() {
        closeModal();
    });
    $('.btn-embed-save').click(function() {
        saveUrl();
    });
    modal.keyup(function(e) {
        if (e.keyCode == 27) { //close on esc key
            closeModal()
        }
        if (e.keyCode == 13) { //save on enter key
            saveUrl();
        }
    });
}