/**
 * Created by crispin on 28/10/2015.
 */


//Toggles between showing and hiding content on click. Possible replacement for accordion.js in the future.

// Credit goes to Heydon Pickering (http://heydonworks.com/practical_aria_examples/#progressive-collapsibles)

function showHide(remove) {
    var showHideTrigger = $('.js-show-hide .js-show-hide__title');

    if (showHideTrigger.length > 0) {
        showHideTrigger.each(function (i) {
            var $this = $(this),
                panel = $this.next(),
                button = $this.children('button');

            if (!remove) {

                // create unique id for aria relationship
                var id = 'collapsible-' + i;

                if ($this.hasClass('is-shown')) {
                    var bool = false;
                } else {
                    var bool = true;
                }

                // wrap the content and make it focusable
                $this.nextUntil('.js-show-hide__title').attr({id: id, 'aria-hidden': bool});

                // inverse the boolean value
                bool = !bool;

                // Add the button inside the title so both the heading and button semantics are read - if prevents multiple buttons being added
                if (button.length == 0) {
                    $this.wrapInner('<button class="js-show-hide__button" type="button" aria-expanded="' + bool + '" aria-controls="' + id + '">');
                }
                button = $this.children('button');

                // Toggle the state properties on click
                button.on('click', function () {
                    var $this = $(this);
                    var state = $this.attr('aria-expanded') === 'false' ? true : false;
                    $this.attr('aria-expanded', state);
                    panel.attr('aria-hidden', !state);

                    // Fix for IE8/9 bug where ordered lists lose numbering on show/hide (see: http://stackoverflow.com/questions/5584500/ordered-list-showing-all-zeros-in-ie9)
                    setTimeout(function(){
                        $('ol').css('counter-reset', 'item');
                    }, 1);
                });
            } else {
                // Set filters to show
                $this.children('button').attr('aria-expanded', 'true');
                panel.attr('aria-hidden', 'false');

                // Remove show/hide functionality
                var heading = $this.children('button').contents();
                heading.unwrap();
            }
        });
    }
}

// Checks if show/hide is open and sets to show if not doing so already
function forceShow(showHideElem) {
    showHideElem.find('.js-show-hide__title button').attr('aria-expanded', 'true');
    showHideElem.find('.js-show-hide__content').attr('aria-hidden', 'false');
}

$(function() {
    // Initalise show/hides on page
    showHide();

    // If page has hash in path open show/hide
    var locationHash = location.hash;
    if (locationHash) {
        forceShow($(locationHash));
    }

    // If an anchor with a hash href attribute is clicked check show/hide needs to be opened
    $('a[href^="#"]').click(function() {
        var sectionId = $($(this).attr('href'));
        forceShow(sectionId);
    });
});
