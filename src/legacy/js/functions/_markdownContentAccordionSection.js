/**
 * Manages markdown content
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */
function renderMarkdownContentAccordionSection(collectionId, data, field, idField) {

    // the list of content sections to render in accordion section.
    var list = data[field];

    // a view model including the list and field name the list is contained in.
    var dataTemplate = {list: list, idField: idField};

    // render the HTML for the accordion section.
    var html = templates.editorContent(dataTemplate);

    // inject the HTML into the accordion section
    $('#' + idField).replaceWith(html);

    // attach event handlers for the buttons.
    initialiseMarkdownContentAccordionSection(collectionId, data, field, idField)
}

function refreshMarkdownContentAccordionSection(collectionId, data, field, idField) {
    var list = data[field];
    var dataTemplate = {list: list, idField: idField};
    var html = templates.editorContent(dataTemplate);
    $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
    initialiseMarkdownContentAccordionSection(collectionId, data, field, idField)
}

function initialiseMarkdownContentAccordionSection(collectionId, data, field, idField) {

    initReplaceInvalidChars()

    // for each entry in the list
    function debugLogAccordionSection() {
        for (var i = 0; i < data[field].length; i++) {
            console.log(data[field][i].title)
        }
    }

    $(data[field]).each(function (index) {

        $('#' + idField + '-title_' + index).on('input', function () {
            data[field][index].title = $(this).val();
            //debugLogAccordionSection();
        });

        // attach edit handler
        $('#' + idField + '-edit_' + index).click(function () {

            // create view model to pass to the markdown editor
            var editedSectionValue = {
                "title": data[field][index].title,
                "markdown": data[field][index].markdown
            };

            // create the function to define what happens on save in the markdown editor
            var saveContent = function (updatedContent) {
                data[field][index].markdown = updatedContent;
                saveContentThenRefreshSection(collectionId, data.uri, data, field, idField);

                // when finished in the markdown editor be sure to refresh the charts / tables / images list to show any newly added
                refreshChartList(collectionId, data);
                refreshTablesList(collectionId, data);
                refreshEquationsList(collectionId, data);
                refreshImagesList(collectionId, data);
            };

            loadMarkdownEditor(editedSectionValue, saveContent, data);
        });

        // attach delete handler
        $('#' + idField + '-delete_' + index).click(function () {
            swal({
                title: "Warning",
                text: "Are you sure you want to delete?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function (result) {
                if (result === true) {

                    // delete the item from the data model
                    data[field].splice(index, 1);

                    // post content to the server and refresh accordion section view.
                    saveContentThenRefreshSection(collectionId, data.uri, data, field, idField);

                    swal({
                        title: "Deleted",
                        text: "This " + idField + " has been deleted",
                        type: "success",
                        timer: 2000
                    });
                }
            });
        });
    });

    // Attach add new handler.
    $('#add-' + idField).off().one('click', function () {
        data[field].push({markdown: "", title: ""});
        saveContentThenRefreshSection(collectionId, data.uri, data, field, idField);
    });

    function sortable() {

        var sortableStartPosition;

        $('#sortable-' + idField).sortable({
            start: function (event, ui) {

                // remember the index of the item at the start of drag + drop
                sortableStartPosition = ui.item.index();
                //console.log("sortable start: " + sortableStartPosition);
            },
            stop: function (event, ui) {

                // determine the new index of the item after being dropped.
                var sortableEndPosition = ui.item.index();
                //console.log("sortable update: Start: " + sortableStartPosition + " now: " + sortableEndPosition) ;

                var sectionsArray = data[field];
                var item = data[field][sortableStartPosition];

                // Move the item from the start drag position to the end drop position in the data model.
                sectionsArray.splice(sortableStartPosition, 1);
                sectionsArray.splice(sortableEndPosition, 0, item);

                saveContentThenRefreshSection(collectionId, data.uri, data, field, idField);
            }
        });
    }

    sortable();

    function saveContentThenRefreshSection(collectionId, path, data, field, idField) {
        putContent(collectionId, path, JSON.stringify(data),
            success = function () {
                Florence.Editor.isDirty = false;
                refreshMarkdownContentAccordionSection(collectionId, data, field, idField);
                refreshPreview(data.uri);
            },
            error = function (response) {
                if (response.status === 400) {
                    sweetAlert("Cannot edit this page", "It is already part of another collection.");
                }
                else {
                    handleApiError(response);
                }
            }
        );
    }
}

