// Set elements to the same height (uses height of tallest element)
function setEqualHeights() {
    if ($('body').is('.viewport-md, .viewport-lg')) {
        var highestBox = 0,
            element = $('.js-equal-height');
        element.each(function() {
            if ($(this).height() > highestBox) {
                highestBox = $(this).height();
            }
        });
        element.height(highestBox);
    }
}

$(function() {
    setEqualHeights();
});

$(window).resize(function() {
    $('.js-equal-height').height('auto');
    setEqualHeights();
});
