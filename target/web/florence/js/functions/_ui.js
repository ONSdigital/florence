/*
*   Function that are applied just to UI/styling and aren't specific to certain screens or functions
 */

var $delegatedSelector = $('#main'); // This should be the highest point event handlers are delegated up to

// Add focus styling to selects
var $closestWrap;
$delegatedSelector.on('focus', '.select-wrap select', function(e) {
    $closestWrap = $(e.target).closest('.select-wrap');
    $closestWrap.toggleClass('select-wrap--focus');
});

$delegatedSelector.on('focusout', '.select-wrap select', function(e) {
    $closestWrap.toggleClass('select-wrap--focus');
});

// Function to add loading icon to a button
function loadingBtn(selector) {
    var loadingHTML = $(templates.loadingAnimation()).css('top', '-3px'); // -3px to get animation in centre of button

    selector
        .width(selector.width()).height(selector.height()) // make btn keep width & height with loading icon
        .empty() // remove button text
        .append(loadingHTML); // Load loading animation template into button
}