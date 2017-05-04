/*
*   Loads datepicker with correct format and moves focus to next form element on selection
 */

function creatorDatePicker() {
    $('#releaseDate').datepicker({
        dateFormat: 'dd MM yy',
        onSelect: function() {
            nextFormElement();
        }
    });
}

function nextFormElement() {
    var $dateInput = $('#releaseDate');

    if ($dateInput.nextUntil('input, select, textarea, button').length) {
        $dateInput.nextUntil('input, select, textarea, button').focus();
        console.log('sibling', $dateInput.nextUntil('input, select, textarea, button'));
    } else if ($dateInput.closest('.edition').nextUntil('input, select, textarea, button').length) {
        $dateInput.closest('.edition').nextUntil('input, select, textarea, button').focus();
        console.log('parents sibling', $dateInput.closest('.edition').nextUntil('input, select, textarea, button'));
    } else {
        console.log('No following inputs');
    }
}
