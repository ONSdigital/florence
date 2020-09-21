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
        var embedTitle = $('input#embed-title').val();
        var fullWidth = $('input#full-width-checkbox').is(':checked');

        if (!embedUrl) {
            console.log("No url added");
            sweetAlert('URL field is empty', 'Please add a url and save again');
            return;
        }

        if (!embedTitle) {
            sweetAlert('Title field is empty', 'Please add a title and save again');
            return;
        }

        // pass in window.location.origin as a base url to handle relative urls
        var parsedEmbedUrl = new URL(embedUrl, window.location.origin);
        if (parsedEmbedUrl.host === window.location.host) {
            embedUrl = parsedEmbedUrl.pathname;
        }

        onSave('<ons-interactive url="' + embedUrl + '" title="'+ embedTitle +'" full-width="' + fullWidth + '"/>');
        modal.remove();

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