$(function() {
    $("footer").append("<div id='viewport-sm' class='js-viewport-size'></div>" +
        "<div id='viewport-md' class='js-viewport-size'></div>" +
        "<div id='viewport-lg' class='js-viewport-size'></div>");

    jsEnhanceViewportSize();
});

$(window).on('resize', function() {
    jsEnhanceViewportSize();
});

function clearViewportSizes() {
    $('body').removeClass('viewport-sm viewport-md viewport-lg');
}

function jsEnhanceViewportSize() {

    $.each($(".js-viewport-size"), function() {

        if ($(this).is(':visible')) {
            clearViewportSizes();
            var idName = $(this).attr('id');
            $('body').addClass(idName);
        }

    });
}
