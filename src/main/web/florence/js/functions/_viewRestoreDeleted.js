
function viewRestoreDeleted(collectionData) {

    $('.js-restore-delete').click(function() {
        getDeletedPages(success = function(deletedPagesData) {
            renderModal(deletedPagesData);
        });
    });

    function renderModal(deletedPagesData) {
        var templateData  = {
                title: "Select a deletion",
                columns: ["Deleted page and URI", "No. of deleted pages", "Date of delete"]
            },
            tableBodyData = buildTableBodyData(deletedPagesData);

        viewSelectModal(templateData, tableBodyData, onItemSelect = function(tableRowIndex) {
            // Callback from view layer saying that item has been clicked
            postRestoreDeletedPage(deletedPagesData[tableRowIndex].id, collectionData.id, success = function(response) {
                // Page/s have been restored to current collection, refresh collection details
                console.log(response);
                viewCollectionDetails(collectionData.id);
            })
        });
    }

    function buildTableBodyData(deletedPagesData) {
        var newTemplateData = [],
            dataLength = deletedPagesData.length,
            i;

        // Build up custom array to build pass to table builder function
        for (i = 0; i < dataLength; i++) {
            var arrayEntry = {
                column1: deletedPagesData[i].pageTitle + "<br>" + deletedPagesData[i].uri,
                column2: deletedPagesData[i].noOfPages,
                column3: deletedPagesData[i].eventDate
            };

            newTemplateData.push(arrayEntry);
        }

        return newTemplateData;
    }

}
