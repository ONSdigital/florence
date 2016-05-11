function loadCreateScreen(parentUrl, collectionId, type, collectionData) {

    // Load data vis creator or ordinary publisher creator
    if (collectionData && collectionData.owners == "dataVis") {
        var html = templates.workCreate({"dataVis": true});
        
    } else {
        var html = templates.workCreate();
    }

    $('.workspace-menu').html(html);
    loadCreator(parentUrl, collectionId, type);
    $('#pagetype').focus();
}
