/**
 *  A simple jQuery accordion
 *  Requires a container ('js-accordion'), a title ('js-accordion__title) and the content ('js-accordion__content')
 **/

function bindAccordions() {
    var $accordions = $('.js-accordion'),
        $title = $accordions.find('.js-accordion__title');

    // if ($accordions.length === 1) {
    //     $accordions.find('.js-accordion__content').addClass('accordion__content--borders');
    // }

    $title.click(function() {
        var $this = $(this),
            $activeAccordions = $('.js-accordion .active'),
            active = false;

        // Remove class that disables animations on load
        $this.next('.js-accordion__content').removeClass('disable-animation');

        // Detect whether the accordion is active already or not
        if ($this.hasClass('active')) {
            active = true;
        }

        // Deselect any accordions already active
        $activeAccordions.closest('.js-accordion').removeClass('active');
        $activeAccordions.removeClass('active');

        // Activate clicked accordion if it wasn't already
        if (!active) {
            $this.closest('.js-accordion').addClass('active');
            $this.addClass('active');
            $this.next('.js-accordion__content').addClass('active');
        }

    });
}
