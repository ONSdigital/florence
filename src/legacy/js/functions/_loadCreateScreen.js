function loadCreateScreen(parentUrl, collectionId, type, collectionData) {
    var isDataVis = type === "visualisation"; // Flag for template to show correct options in select
    var html = templates.workCreate({"dataVis": isDataVis});

    $('.workspace-menu').html(html);
    loadCreator(parentUrl, collectionId, type, collectionData);
    $('#pagetype').focus();
}
