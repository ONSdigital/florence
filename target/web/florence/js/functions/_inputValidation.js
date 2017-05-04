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
        sweetAlert({
            title: "Invalid page name",
            text: "The words 'current', 'latest' and 'data' are reserved paths so can't be used as a page name",
            type: "warning"
        });
        $inputSelector.val('');
        bool = false;
    } else if (!$inputSelector.val()) { // Check inputs contains something
        sweetAlert({
            title: "Page name can't be left empty",
            type: "warning"
        });
        bool = false;
    } else if ($inputSelector.val().length < 5 && !isCustomSelector) { // Check page name length is longer than 4 characters
        sweetAlert({
            title: "Invalid page name",
            text: "A page name must have more than 4 characters",
            type: "warning"
        });
        bool = false;
    }
    
    return bool
}
