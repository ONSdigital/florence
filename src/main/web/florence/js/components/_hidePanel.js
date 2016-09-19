/**
 * Hide panel off-screen
 * @param options = options that can be passed to the function to perform
 *
 * @option onHide = function to run at the end of the hide animation
 * @options moveCenteredPanel = if true then remove margin from the centered selectable panel
 */

function hidePanel(options) {
    $('.js-selectable-table tbody tr').removeClass('selected');

    if (options.onHide) {
        // Run any functions set to run once the off-screen panel is hidden
        $('.panel--off-canvas').stop().animate({right: "-50%"}, 500, function() {
            options.onHide();
        });
    } else {
        // Default to just hiding off-screen panel
        $('.panel--off-canvas').stop().animate({right: "-50%"}, 500);
    }

    if (options.moveCenteredPanel) {
        // Add the default margin back in for the centered panel
        $('.panel--centred').animate({marginLeft: "25%"}, 800);
    }
}
