/**
 * Manage files associated with content
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addFile(collectionId, data, field, idField) {
    var list = data[field];
    var downloadExtensions, header, button;
    if (field === 'supplementaryFiles') {
        header = 'Supplementary files';
        button = 'supplementary file';
    } else if (field === 'pdfDownloads') {
        header = 'Upload methodology PDF file';
        button = 'pdf';
    } else if (field === 'pdfTable') {
        header = 'PDF Table';
        button = 'pdf';
    } else {
        header = 'Upload files';
        button = 'file';
    }
    var dataTemplate = {list: list, idField: idField, header: header, button: button};
    var html = templates.editorDownloads(dataTemplate);
    $('#' + idField).replaceWith(html);
    var uriUpload;

    $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

    //Edit
    if (!data[field] || data[field].length === 0) {
        var lastIndex = 0;
    } else {
        $(data[field]).each(function (index) {
            // Delete
            $('#' + idField + '-delete_' + index).click(function () {
                fileDelete(collectionId, data, field, index);
            });
        });
    }

    //Add
    if (data.type === 'static_adhoc') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.pdf$|.zip$/;
    } else if (data.type === 'static_qmi') {
        downloadExtensions = /\.pdf$/;
    } else if (data.type === 'article_download' || (data.type === 'static_methodology_download' && field === 'pdfDownloads')) {
        downloadExtensions = /\.pdf$/;
    } else if (data.type === 'static_methodology_download' && field === 'downloads') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.ppt$|.zip$/;
    } else if (data.type === 'static_methodology') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.ppt$|.pdf$|.zip$/;
    } else if (data.type === 'static_foi') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.pdf$|.zip$/;
    } else if (data.type === 'static_page') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.pdf$|.zip$/;
    } else if (data.type === 'static_article') {
        downloadExtensions = /\.xls$|.xlsx$|.pdf$|.zip$/;
    } else if (data.type === 'dataset' || data.type === 'timeseries_dataset') {
        downloadExtensions = /\.csv$|.xls$|.xlsx$|.doc$|.pdf$|.zip$/;
    } else if (data.type === 'article' || data.type === 'bulletin'|| data.type === 'compendium_chapter') {
        downloadExtensions = /\.pdf$/;
    } else {
        sweetAlert("This file type is not valid", "Contact an administrator if you need to add this type of file in this document", "info");
    }

    $('#add-' + idField).one('click', function () {
        if ((data.type === 'article' || data.type === 'bulletin') && (data[field] && data[field].length > 0)) {
            sweetAlert("You can upload only one file here");
            return false;
        } else {
            if (!data[field]) {
                data[field] = [];
            }
            uploadFile(collectionId, data, field, idField, lastIndex, downloadExtensions, addFile);
        }
    });

    $(function () {
        $('.add-tooltip').tooltip({
            items: '.add-tooltip',
            content: 'Type title here and click Save to add it to the page',
            show: "slideDown", // show immediately
            open: function (event, ui) {
                ui.tooltip.hover(
                    function () {
                        $(this).fadeTo("slow", 0.5);
                    });
            }
        });
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

