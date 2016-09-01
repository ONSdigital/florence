/**
 * Animate off-screen panel to appear on-screen
 *
 * @param $this = the table item that has been selected
 * @param options = object of options for the function to use
 *
 * @options html = contents of the panel/slider
 * @options moveCenteredPanel = if true then remove margin from the centered selectable panel
 */

function showPanel($this, options) {

    if ($this) {
        $('.js-selectable-table tbody tr').removeClass('selected');
        $this.addClass('selected');
    }

    if (options.html) {
        $('.panel--off-canvas').html(options.html).animate({right: "0%"}, 500);
    } else {
        $('.panel--off-canvas').animate({right: "0%"}, 500);
    }

    if (options.moveCenteredPanel) {
        // Remove the margin from the centered panel to make room for off-screen panel
        $('.panel--centred').animate({marginLeft: "0"}, 500);
    }
}