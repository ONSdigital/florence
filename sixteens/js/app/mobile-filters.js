// Function to change search filters in mobile to show/hide

$(function() {
    if ($('.js-mobile-filters').length > 0 && $('body').is('.viewport-sm')) {
        mobileFilters();
        showHide();
    }
});

function mobileFilters() {
    var $filters = $('.js-mobile-filters'),
        $filtersTitle = $('.js-mobile-filters__title'),
        $contents = $('.js-mobile-filters__contents'),
        $clearFilters = $filters.find('a#clear-search'),
        $sortBy = $('.js-mobile-filters__sort');

    $filters.addClass('js-show-hide show-hide show-hide--light').removeClass('tiles__item tiles__item--nav-type');
    $filtersTitle.addClass('mobile-filters__title js-show-hide__title show-hide__title').removeClass('tiles__title-h3 tiles__title-h3--nav');
    $contents.addClass('mobile-filters__contents js-show-hide__contents').removeClass('tiles__content tiles__content--nav');
    $clearFilters.prependTo($contents);
    $sortBy.prependTo($contents).css('display', 'inline-block');
};