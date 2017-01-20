
function viewRestoreDeleted(collectionData) {

    var onSearchDeletedPagesData;

    // $('.js-restore-delete').click(function() {
        renderModal();
        bindTableClick();

        getDeletedPages(success = function(deletedPagesData) {
            onSearchDeletedPagesData = deletedPagesData;
            renderTableBody(deletedPagesData);
        });
    // });

    function renderModal() {
        var templateData  = {
            title: "Select a deletion",
            columns: ["Deleted page and URI", "No. of deleted pages", "Date of delete"]
        };
        templateData['noOfColumns'] = templateData.columns.length;
        viewSelectModal(templateData, onSearch);
    }

    function renderTableBody(deletedPagesData) {
        var tableBodyHtml = function() {
            var i,
                deletionsLength = deletedPagesData.length,
                html = [];
            for (i = 0; i < deletionsLength; i++) {
                console.log(deletedPagesData[i]);
                html.push("<tr data-id='" + deletedPagesData[i].id + "'>" +
                    "<td>"+ deletedPagesData[i].pageTitle + "<br>" + deletedPagesData[i].uri + "</td>" +
                    "<td>" + deletedPagesData[i].deletedFiles.length + "</td>" +
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
            // Add to new array if search term and page name or uri match it
            if ((onSearchDeletedPagesData[i].pageTitle).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 || (onSearchDeletedPagesData[i].uri).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                filteredArray.push(onSearchDeletedPagesData[i]);
            }
        }

        renderTableBody(filteredArray)
    }
}
