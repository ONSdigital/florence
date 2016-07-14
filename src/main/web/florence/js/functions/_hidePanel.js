/**
 * Hide panel off-screen
 * @param onHide - function to run at the end of the hide animation
 */

function hidePanel(onHide, moveCenteredPanel) {
    $('.js-selectable-table tbody tr').removeClass('selected');

    if (onHide) {
        // Run any functions set to run once the off-screen panel is hidden
        $('.panel--off-canvas').stop().animate({right: "-50%"}, 500, function() {
            onHide();
        });
    } else {
        // Default to just hiding off-screen panel
        $('.panel--off-canvas').stop().animate({right: "-50%"}, 500);
    }

    if (moveCenteredPanel) {
        // Add the default margin back in for the centered panel
        $('.panel--centred').animate({marginLeft: "25%"}, 800);
    }
}
