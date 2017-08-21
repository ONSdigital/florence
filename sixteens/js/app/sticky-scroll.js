/**
 * Created by jon on 05/11/2015.
 */

$(function() {

    if ($('.js-sticky-sidebar').length > 0) {

        // kick in twbs affix plugin

        $(".js-sticky-sidebar").affix({
            offset: {
                top: function () {
                    return (this.top = $('header').outerHeight(true) + $('.page-intro').outerHeight(true))
                },
                bottom: function () {
                    return (this.bottom = $('footer').outerHeight(true))
                }
            }
        });

    }

});

// function to work out if an element is within current viewport

$.fn.isOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

// function to work out what percentage of an element is within current viewport

$.fn.percentOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        bottom : win.scrollTop() + win.height()
    };

    var el = this,
        elHeight = el.height(),
        offsetTop = el.offset().top,
        offsetBottom = el.offset().top + elHeight;


    if (viewport.top >= offsetTop && viewport.top < offsetBottom) {
        percentage = ((offsetBottom - viewport.top) / elHeight) * 100;
    } else if (viewport.bottom > offsetTop && viewport.bottom < offsetBottom) {
        percentage = ((viewport.bottom - offsetTop) / elHeight) * 100;
        //console.log("(offsetTop: " + offsetTop + "- scrollBottom: " + scrollBottom + ") / sectionHeight: " + sectionHeight)
    } else if ((viewport.top > offsetTop && viewport.bottom < offsetBottom) || (viewport.top < offsetTop && viewport.bottom > offsetBottom)) {
        percentage = 100;
    } else {
        percentage = 0;
    }

    return percentage;

};



    $(window).on("load scroll", function () {

        $.each($(".section-container"), function () {

            var section = $(this),
                sectionTitle = section.find('h2').attr('id');

            if ($(this).isOnScreen()) {
                $(this).percentOnScreen();

            } else {
                percentage = 0;

            }

            bgTransparency = percentage / 100;

            $.each($(".side-bar__item"), function () {
                $("#" + sectionTitle + "-menu-item").css("background-color", "rgba(221, 221, 221," + bgTransparency + ")");
            });
        });

    });

