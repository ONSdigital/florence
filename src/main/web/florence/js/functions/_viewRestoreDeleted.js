
function viewRestoreDeleted(collectionData) {

    var onSearchDeletedPagesData;

    $('.js-restore-delete').click(function() {
        renderModal();
        bindTableClick();

        getDeletedPages(success = function(deletedPagesData) {
            onSearchDeletedPagesData = deletedPagesData;
            renderTableBody(deletedPagesData);
        });
    });

    function renderModal() {
        var templateData  = {
            title: "Select a deletion",
            columns: ["Deleted page and URI", "No. of deleted pages", "Date of delete"]
        };

        viewSelectModal(templateData, onSearch);


            // tableBodyData = buildTableBodyData(deletedPagesData);

        // viewSelectModal(templateData, tableBodyData, onItemSelect = function(tableRowIndex) {
        //     // Callback from view layer saying that item has been clicked
        //     postRestoreDeletedPage(deletedPagesData[tableRowIndex].id, collectionData.id, success = function(response) {
        //         // Page/s have been restored to current collection, refresh collection details
        //         console.log(response);
        //         viewCollectionDetails(collectionData.id);
        //     })
        // });
    }

    function renderTableBody(deletedPagesData) {
        var tableBodyHtml = function() {
            var i,
                deletionsLength = deletedPagesData.length,
                html = [];
            for (i = 0; i < deletionsLength; i++) {
                html.push("<tr data-id='" + deletedPagesData[i].id + "'>" +
                    "<td>"+ deletedPagesData[i].pageTitle + "<br>" + deletedPagesData[i].uri + "</td>" +
                    "<td>" + deletedPagesData[i].noOfPages + "</td>" +
                    "<td>" + deletedPagesData[i].eventDate + "</td>" +
                    "</tr>")
            }

            return html.join();
        };

        $('#js-modal-select__body').empty().append(tableBodyHtml());
    }

    function bindTableClick() {
        $('#js-modal-select__body').on('click', 'tr', function() {
            // Restore page to current collection, close modal and refresh collection details
            postRestoreDeletedPage($(this).attr('data-id'), collectionData.id, success = function(response) {
                console.log(response);
                $('#js-modal-select').remove();
                viewCollectionDetails(collectionData.id);
            })
        });
    }

    function onSearch(searchValue) {

        var deletedPagesDataLength = onSearchDeletedPagesData.length,
            filteredArray = [],
            i;

        for (i = 0; i < deletedPagesDataLength; i++) {
            if ((onSearchDeletedPagesData[i].pageTitle).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                filteredArray.push(onSearchDeletedPagesData[i]);
            }
        }

        renderTableBody(filteredArray)
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
