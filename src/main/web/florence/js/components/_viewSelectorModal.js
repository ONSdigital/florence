/**
 * Reusable component that renders selector modal and binds re-usable functionality (ie search input and cancel button)
 */


function viewSelectModal(templateData, onSearch) {
    var modalHtml = templates.selectorModal(templateData);
    $('body').append(modalHtml);
    bindSelectModalEvents();

    function bindSelectModalEvents() {
        var $search = $('#js-modal-select__search');

        $('#js-modal-select__cancel').click(function() {
            closeModal()
        });

        $search.on('input', function() {
            onSearch($(this).val());
        });

        $search.focus();

        $(document).keydown(function(event) {
            if (event.keyCode === 27) {
                closeModal()
            }
        });

    }

   function closeModal() {
       $('#js-modal-select').remove();
       $(document).off('keydown');
   }
}
