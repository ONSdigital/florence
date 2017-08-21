$(function() {


    if ($('body').contents().find('*').hasClass('js-sticky-toc')) {
        //variables
        var stickyTrigger = '.js-sticky-toc__trigger';
        var contentStart = $(stickyTrigger).offset().top;
        var locationHash = $(location.hash).attr('id');
        var stickyTocHeight = function() {return parseInt($('.table-of-contents--sticky__wrap').css('height'))}; // height of sticky toc
        var tocSelectList = $('<select id="sticky-toc" class="table-of-contents--sticky__select ">');
        var scrollTop = $(window).scrollTop();
        var pdfDownloadLink = $('.js-pdf-dl-link').attr('href');
        var $toc = $('#toc:first');

        // recalculate trigger point if show-hide button is clicked
        $('.js-show-hide__button').click(function() {
            contentStart = $(stickyTrigger).offset().top;
        });

        //remove html and body height 100% to allow jquery scroll functions to work properly
        $('html, body').css('height', 'auto');


        //insert sticky wrapper
        var tocStickyWrap = $('<div class="table-of-contents--sticky__wrap print--hide"><div class="wrapper"><div class="col-wrap"><div id="stickySelectArea" class="col col--md-30 col--lg-40 margin-left-sm--1 margin-left-md--1"><div class="table-of-contents--sticky__select-wrap">');
        $(tocStickyWrap).insertAfter($toc);
        $('.table-of-contents--sticky__wrap #stickySelectArea').prepend('<label for="sticky-toc" class="table-of-contents--sticky__heading font-size--h2">Table of contents</label>');

        //add in print options
        if ($('.js-print-pdf').length > 0) {
            var printStickyWrap = $('<div class="col col--md-17 col--lg-19 hide--sm"><p class="text-right padding-top-md--0 padding-bottom-md--0 margin-bottom-md--1 print--hide"><a href="" id="" class="link-complex nojs-hidden js-enhance--show js-print-page">Print this page&nbsp;</a><span class="icon icon-print--light-small"></span></p><p class="text-right padding-top-md--0 padding-bottom-md--1 margin-top-md--0 margin-bottom-md--0 print--hide js-enhance--show"><a href="' + pdfDownloadLink + ' " class="link-complex">Download as PDF&nbsp;</a><span class="icon icon-download--light-small"></span></p></div>');
            $(printStickyWrap).insertAfter($('.table-of-contents--sticky__wrap .col'));
        }


        //create select list of sections
        $(tocSelectList).append($('<option/>', {
            value: '',
            text: '-- Select a section --'
        }));

        $($toc.find('li a')).each(function(i) {
            i = i + 1;
            var text = i + '. ' + $(this).text();
            var href = $(this).attr('href');
            $(tocSelectList).append($('<option/>', {
                value: href,
                text: text
            }));
        });

        //add toc select to sticky wrapper
        $('.table-of-contents--sticky__wrap .table-of-contents--sticky__select-wrap').append(tocSelectList);

        $('.table-of-contents--sticky__select').change(function() {
            var location = $(this).find('option:selected').val();
            if (location) {
                // expands section if show/hide
                forceShow($(location));
                //if ($(location).hasClass('is-collapsed')) {
                //    $(location).removeClass('is-collapsed').addClass('is-expanded');
                //}

                var functionTrigger = true;

                //animates scroll and offsets page to counteract sticky nav
                $('html, body').animate({
                    scrollTop: $(location).offset().top - stickyTocHeight()
                }, 1000, function() {
                    //stops function running twice - once for 'html' and another for 'body'
                    if (functionTrigger) {
                        //adds location hash to url without causing page to jump to it - credit to http://lea.verou.me/2011/05/change-url-hash-without-page-jump/
                        if (history.pushState) {
                            history.pushState(null, null, location);
                        }
                        //TODO Add hash to window.location in IE8-9 (don't support history.pushState)
                        // else {
                        //     window.location.hash = location;
                        //     $('html, body').scrollTop( $(location.hash).offset().top - 60 );
                        // }

                        //var page = window.location.pathname + location; // No longer record anchor click as page views
                        //jsEnhanceTriggerAnalyticsEvent(page);
                        functionTrigger = false;
                    }
                });
            }
        });


        // sticky toc function that evaluates scroll position and activates the sticky toc as appropriate
        function stickyTOC() {
            scrollTop = $(window).scrollTop();
            if (scrollTop > contentStart) {
                $('#toc').addClass('table-of-contents-ordered-list-hide');
                // $('#toc').removeClass('table-of-contents-ordered-list');
                $(stickyTrigger).css('padding-top', stickyTocHeight);
                $('.table-of-contents--sticky__wrap').show();
                updateSelected(scrollTop);
            } else {
                // $('#toc').addClass('table-of-contents-ordered-list');
                $('#toc').removeClass('table-of-contents-ordered-list-hide');
                $(stickyTrigger).css('padding-top', '0');
                $('.table-of-contents--sticky__wrap').hide();
            }
        }

        //Update the selected option on scroll
        function updateSelected(scrollTop) {
            var $sections = $(stickyTrigger + ' .js-sticky-toc__section');
            var top = $.grep($sections, function(item) {
               return $(item).position().top <= scrollTop+stickyTocHeight();
            });
            var topLength = $(top).length;
            var activeSectionId = $($(top)[topLength - 1]).attr('id');
            if (activeSectionId) {
                $('.table-of-contents--sticky__select').val("#" + activeSectionId);
            }
        }

        //Offsets page to make room for sticky nav if arrive on page directly at section
        if (locationHash) {
            $(window).load(function() {
                $('html, body').scrollTop($('#' + locationHash).offset().top - stickyTocHeight());
            });
        }

        stickyTOC();
        updateSelected(scrollTop);
        $(window).scroll(function() {
            stickyTOC();
        });
    }
})