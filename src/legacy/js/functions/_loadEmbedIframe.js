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
        var fullWidth = $('input#full-width-checkbox').is(':checked');
        var embedUrl2 = $('input#embed-url-2').val();
        console.log(embedUrl2," - 1");

        if (!embedUrl) {
            console.log("No url added");
            sweetAlert('URL field is empty', 'Please add a url and save again');
            return;
        }

        // pass in window.location.origin as a base url to handle relative urls
        var parsedEmbedUrl = new URL(embedUrl, window.location.origin);
        if (parsedEmbedUrl.host === window.location.host) {
            embedUrl = parsedEmbedUrl.pathname;
        }
        if (embedUrl2) {
            var parsedEmbedUrl2 = new URL(embedUrl2, window.location.origin);
            if (parsedEmbedUrl2.host === window.location.host) {
                embedUrl2 = parsedEmbedUrl2.pathname;
            }
            embedUrl2 = ` url2="${embedUrl2}"`;
        }

        onSave(`<ons-interactive url="${embedUrl}" full-width="${fullWidth}"${embedUrl2}/>`);
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