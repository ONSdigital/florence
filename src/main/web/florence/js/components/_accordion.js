/**
 *  A simple jQuery accordion (inspired by 'https://css-tricks.com/snippets/jquery/simple-jquery-accordion/')
 *  Requires a container ('js-accordion'), a title ('js-accordion__title) and the content ('js-accordion__content')
 **/
function bindAccordions() {
    var $title = $('.js-accordion .js-accordion__title');

    $title.click(function(e) {
        $(this).find('.js-accordion__content').addClass('.active');
    });
}
