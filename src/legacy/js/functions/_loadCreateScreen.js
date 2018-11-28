function loadCreateScreen(parentUrl, collectionId, type, collectionData) {
    var showCreateAPIDatasetOption = Florence.globalVars.config.enableDatasetImport;
    var isDataVis = type === "visualisation"; // Flag for template to show correct options in select
    var html = templates.workCreate({
        "dataVis": isDataVis, 
        "showCreateAPIDatasetOption": showCreateAPIDatasetOption
    });

    $('.workspace-menu').html(html);
    loadCreator(parentUrl, collectionId, type, collectionData);
    $('#pagetype').focus();
}
