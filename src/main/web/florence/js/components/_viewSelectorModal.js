/**
 * Reusable component that renders selector modal and binds re-usable functionality (ie search input and cancel button)
 */


function viewSelectModal(templateData, tableBodyData, onItemSelect) {
    var modalHtml = templates.selectorModal(templateData);
    $('body').append(modalHtml);
    bindSelectModalEvents();
    buildTableBody();

    function bindSelectModalEvents() {
        var $modal = $('#js-modal-select');

        $('#js-modal-select__cancel').click(function() {
            $modal.remove();
        });

        $modal.find('#js-modal-select__body').on('click', 'tr', function() {
            onItemSelect($(this).index());
            $modal.remove();
        });

    }

    function buildTableBody() {
        var tableBodyHtml = function() {
            var i,
                tableBodyDataLength = tableBodyData.length,
                html = [];

            // Loop through each row object
            for (i = 0; i < tableBodyDataLength; i++) {
                var tableRow = [];

                // Loop through each property in row object and wrap in <td> element
                for (var property in tableBodyData[i]) {
                    if(!tableBodyData[i].hasOwnProperty(property)) continue;
                    tableRow.push("<td>" + tableBodyData[i][property] + "</td>");
                }

                // Join together <td>s, wrap in <tr> and push into HTML variable
                html.push("<tr>" + tableRow.join() + "</tr>");
            }

            // Return string of table body HTML
            return html.join();
        };

        $('#js-modal-select__body').html(tableBodyHtml());
    }
}
