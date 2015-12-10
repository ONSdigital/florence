/**
 * Created by crispin on 10/12/2015.
 */
function loadEmbedIframe(onSave) {
    // add modal window
    $('.workspace-menu').append(templates.embedIframe());

    // variables
    var modal = $(".modal");
    var iframeId = Math.floor(Math.random()*99999) + 10000;

    function closeModal() {
        modal.remove();
    }

    function saveUrl() {
        var embedUrl = $('input#embed-url').val();
        onSave('<ons-interactive url="' + embedUrl + '" id="interactive-' + iframeId + '" />');
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