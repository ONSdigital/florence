function loadCreateScreen(parentUrl, collectionId, type, collectionData) {
    var isDataVis = false; // Flag for template to show correct options in select

    // Load data vis creator or ordinary publisher creator
    if (collectionData && collectionData.collectionOwner == "DATA_VISUALISATION") {
        isDataVis = true;
        type = 'visualisation';
    }

    var html = templates.workCreate({"dataVis": isDataVis});

    $('.workspace-menu').html(html);
    loadCreator(parentUrl, collectionId, type, collectionData);
    $('#pagetype').focus();
}
