/**
 * Overlays modal for selecting where a node of the browse tree is being moved to
 * @param fromUrl - where the node is being moved from
 */

function moveBrowseNode(fromUrl) {
    var moveToBtn = "<button class='btn btn--positive btn-browse-move-to'>Move here</button>",
        moveInProgress = true, // flag to use to see state of move process
        headerHeight = 98,
        $browseTree = $('#browse-tree'),
        $wrapper = $('.wrapper'),
        overlay = $('<div class="overlay"></div>'),
        browseTreeMoveHeader = $('<div class="workspace-menu__header"><h2>Select a location</h2></div>'),
        $treeBrowser = $('.workspace-browse');

    // Toggle buttons on selected item
    showBrowseTreeModal();
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
            hideBrowseTreeModal();

        });

    });

    // Removes the usual buttons on browse tree items and replaces them with a single 'Move here' button
    function toggleMoveHereButton() {
        var $thisButtons = $('.page__buttons--list.selected'),
            $moveToButton = $('.btn-browse-move-to');

        // Remove previous, so they're not littered around the DOM or if move is finished
        $moveToButton.remove();

        // Toggle current buttons (show if move is finished or hide if move is in progress
        $thisButtons.find('.js-browse__buttons--primary, .js-browse__buttons--secondary').toggle();

        if (moveInProgress) {
            // Hide existing buttons in selected item and add in new 'Move here' button
            $thisButtons.append(moveToBtn);
        }

    }

    function showBrowseTreeModal() {
        // give blacked put appearance to page
        $wrapper.append(overlay);
        // add move header to browse tree
        $browseTree.prepend(browseTreeMoveHeader);
        // bring browse tree element in front of overlay
        $browseTree.css({'z-index': 1001, 'position': 'relative'});
        // resize browser height because adding header has taken up space
        $treeBrowser.height($treeBrowser[0].offsetHeight - headerHeight);
    }

    function hideBrowseTreeModal() {
        //remove overlay & header
        overlay.remove();
        browseTreeMoveHeader.remove();
        // 'reset' z-index
        $browseTree.css({'z-index': 1, 'position': 'relative'});
        // calculate size after removing header
        $treeBrowser.height($treeBrowser[0].offsetHeight + headerHeight);
    }

}
