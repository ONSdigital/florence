/**
 * Animate off-screen panel to appear on-screen
 * @param $this = the table item that has been selected
 * @param html = contents of the panel/slider
 * @param moveCenteredPanel = if true then remove margin from it
 */

function showPanel($this, html, moveCenteredPanel) {
    $('.js-selectable-table tbody tr').removeClass('selected');
    $this.addClass('selected');

    if (html) {
        $('.panel--off-canvas').html(html).animate({right: "0%"}, 500);
    } else {
        $('.panel--off-canvas').animate({right: "0%"}, 500);
    }

    if (moveCenteredPanel) {
        // Remove the margin from the centered panel to make room for off-screen panel
        $('.panel--centred').animate({marginLeft: "0"}, 500);
    }
}