/**
 * Manages file with description
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addFileWithDetails(collectionId, data, field, idField) {
    var list = data[field];
    var dataTemplate = {list: list, idField: idField,};
    var html = templates.editorDownloadsWithSummary(dataTemplate);
    $('#' + idField).replaceWith(html);
    var downloadExtensions;

    $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

    // Edit
    if (!data[field] || data[field].length === 0) {
        var lastIndex = 0;
    } else {
        $(data[field]).each(function (index) {
            // Delete
            $('#' + idField + '-delete_' + index).click(function () {
                fileDelete(collectionId, data, field, index);
            });

            // Edit
            $('#' + idField + '-edit_' + index).click(function () {
                var editedSectionValue = {
                    "title": $('#' + idField + '-title_' + index).val(),
                    "markdown": $('#' + idField + '-summary_' + index).val()
                };

                var saveContent = function (updatedContent) {
                    data[field][index].fileDescription = updatedContent;
                    data[field][index].title = $('#' + idField + '-title_' + index).val();
                    updateContent(collectionId, data.uri, JSON.stringify(data));
                };
                loadMarkdownEditor(editedSectionValue, saveContent, data);
            });
        });
    }

    //Add
    if (data.type === 'compendium_data') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.zip$/;
    } else {
        sweetAlert("This file type is not valid", "Contact an administrator if you need to add this type of file in this document", "info");
    }

    $('#add-' + idField).one('click', function () {
        uploadFile(collectionId, data, field, idField, lastIndex, downloadExtensions, addFileWithDetails);
    });

    function sortable() {
        $('#sortable-' + idField).sortable({
            stop: function () {
                $('#' + idField + ' .edit-section__sortable-item--counter').each(function (index) {
                    $(this).empty().append(index + 1);
                });
            }
        });
    }

    sortable();
}