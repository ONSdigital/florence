function loadBlockquoteBuilder(onSave) {
    // add modal window
    $('.workspace-menu').append(templates.blockquoteBuilder());

    // variables
    var modal = $(".modal");

    // modal functions
    function closeModal() {
        modal.remove();
    }
    function saveBlockquote() {
        var quoteContent = $('input#blockquote-quote').val();
        var quoteAttribution = $('input#blockquote-attribution').val();

        if (!quoteContent) {
            sweetAlert('Quote field is empty', 'Please add a quote and save again');
            return;
        }

        onSave('<ons-quote content="' + quoteContent + renderAttributionIfPopulated(quoteAttribution) + '" />');
        modal.remove();
    }

    function renderAttributionIfPopulated(attribution) {
        return attribution ? '" attr="' + attribution : ''
    }

    // bind events
    $('.btn-blockquote-cancel').click(function() {
        closeModal();
    });
    $('.btn-blockquote-save').click(function() {
        saveBlockquote();
    });
    modal.keyup(function(e) {
        if (e.keyCode == 27) { //close on esc key
            closeModal()
        }
        if (e.keyCode == 13) { //save on enter key
            saveBlockquote();
        }
    });
}