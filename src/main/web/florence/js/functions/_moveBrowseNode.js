/**
 * Overlays modal for selecting where a node of the browse tree is being moved to
 * @param fromUrl - where the node is being moved from
 */

function moveBrowseNode(fromUrl) {
    var moveToBtn = "<button class='btn btn--positive btn-browse-move-to'>Move here</button>",
        moveInProgress = true; // flag to use to see state of move process

    // Toggle buttons on selected item
    toggleMoveHereButton();

    // Switch off browse tree changes updating the preview or global pagePath
    $('.js-browse__item-title').off().click(function (e) {
        var $this = $(this),
            itemUrl = $this.closest('.js-browse__item').attr('data-url');

        // Set previously selected item to normal
        toggleMoveHereButton();

        if (itemUrl) {
            treeNodeSelect(itemUrl);
        } else {
            selectParentDirectories($this);
        }

        openBrowseBranch($this);

        // Toggle buttons on newly selected item
        toggleMoveHereButton();

        $('.btn-browse-move-to').click(function() {

            // Data to be sent to Zebedee
            var toUrl = $(this).closest('.js-browse__item').attr('data-url'),
                moveData = {fromUrl: fromUrl, toUrl: toUrl};
            console.log('Move data: ', moveData);

            // Remove current event binding and return ordinary browse tree functionality
            $('.js-browse__item-title').off();
            bindBrowseTreeClick();

            // Set state of move to finished
            moveInProgress = false;

            // Show ordinary browse tree buttons
            toggleMoveHereButton();
        });

    });

    // Removes the usual buttons on browse tree items and replaces them with a single 'Move here' button
    function toggleMoveHereButton() {
        var $thisButtons = $('.page__buttons--list.selected'),
            $moveToButton = $('.btn-browse-move-to');

        // Remove previous, so they're not littered around the DOM or if move is finished
        $moveToButton.remove();

        // Toggle current buttons (show if move is finished or hide if move is in progress
        $thisButtons.find('button').toggle();

        if (moveInProgress) {
            // Hide existing buttons in selected item and add in new 'Move here' button
            $thisButtons.append(moveToBtn);
        }

    }
}
