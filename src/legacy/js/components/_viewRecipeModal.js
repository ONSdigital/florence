/**
 * Reusable component that renders recipe modal and binds re-usable functionality (ie cancel button)
 */


function viewRecipeModal(templateData) {
    var modalHtml = templates.recipeModal(templateData);
    $('body').append(modalHtml);
    bindrecipeModalEvents();

    function bindrecipeModalEvents() {
        $(document).keydown(function(event) {
            if (event.keyCode === 27) {
                closeModal()
            }
        });
    }

   function closeModal() {
       $('#js-modal-recipe').remove();
       $(document).off('keydown');
   }
}
