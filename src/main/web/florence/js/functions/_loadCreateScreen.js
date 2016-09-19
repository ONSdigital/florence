function loadCreateScreen(parentUrl, collectionId, type, collectionData) {
    // Load data vis creator or ordinary publisher creator
    if (collectionData && collectionData.collectionOwner == "DATA_VISUALISATION") {
        var html = templates.workCreate({"dataVis": true});
    } else {
        var html = templates.workCreate();
    }

    $('.workspace-menu').html(html);
    loadCreator(parentUrl, collectionId, type, collectionData);
    $('#pagetype').focus();
}
