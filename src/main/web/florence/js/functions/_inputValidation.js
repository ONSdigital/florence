/**
 * Validate an inputs value before it's submitted to the server
 */

function validatePageName(customSelector) {
    var $inputSelector = $('#pagename');
    var isCustomSelector;
    var bool = true;

    // Allow other inputs to use same validation (eg edition)
    if (customSelector) {
        $inputSelector = $(customSelector);
        isCustomSelector = true;
    }

    // Do validation
    if ($inputSelector.val().toLowerCase() === 'current' || $inputSelector.val().toLowerCase() === 'latest' || $inputSelector.val().toLowerCase() === 'data') { // Check for reserved words (ie endpoints in zebedee/babbage)
        sweetAlert('That is not an accepted value for a title');
        $inputSelector.val('');
        bool = false;
    } else if ($inputSelector.val().length < 5 && !isCustomSelector) { // Check page name length is longer than 4 characters
        sweetAlert('A page name must have more than 4 characters');
        bool = false;
    }
    else if (!$inputSelector.val()) { // Check inputs contains something
        sweetAlert('You must enter complete all fields');
        bool = false;
    }
    
    return bool
}
