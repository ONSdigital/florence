/**
 * Add tags to articles
 * @param collectionId
 * @param data
 * @param templateData
 */

 function tags(collectionId, data, templateData) {

    console.log(collectionId)
    console.log(data)
    console.log(templateData)
    console.log(getPathNameTrimLast())
    $.ajax({
        url: getPathNameTrimLast() + "/topics",
        dataType: 'json',
        crossDomain: true,
        success: function (result) {
            console.log(result)
        },
        error: function (result) {
            console.log('Error: ' + result);
        }
    });

    var dataTemplate = {'tags': 'tags'};
    var html = templates.tags(dataTemplate);
    $('#' + 'tags').replaceWith(html);
}

// - Endpoints: 
//    api.get("/topics/{id}", api.getTopicPublicHandler)
//    api.get("/topics/{id}/subtopics", api.getSubtopicsPublicHandler)
//    api.get("/topics/{id}/content", api.getContentPublicHandler)
//    api.get("/topics", api.getTopicsListPublicHandler)

/**
 * Manages topics to appear in list pages
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

//  function editTopics(collectionId, data, templateData, field, idField) {
//     var list = templateData[field];
//     var dataTemplate = {list: list, idField: idField};
//     var html = templates.editorTopics(dataTemplate);
//     $('#' + idField).replaceWith(html);
//     initialiseTopics(collectionId, data, templateData, field, idField);
//     resolveTopicTitle(collectionId, data, templateData, field, idField);
//     $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
// }

// function refreshTopics(collectionId, data, templateData, field, idField) {
//     var list = templateData[field];
//     var dataTemplate = {list: list, idField: idField};
//     var html = templates.editorTopics(dataTemplate);
//     $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
//     initialiseTopics(collectionId, data, templateData, field, idField);
// }

// function initialiseTopics(collectionId, data, templateData, field, idField) {
//     // Load
//     if (!data[field] || data[field].length === 0) {
//         editTopics['lastIndex' + field] = 0;
//     } else {
//         $(data[field]).each(function (index) {
//             editTopics['lastIndex' + field] = index + 1;

//             // Delete
//             $('#' + idField + '-delete_' + index).click(function () {
//                 swal({
//                     title: "Warning",
//                     text: "Are you sure you want to delete this link?",
//                     type: "warning",
//                     showCancelButton: true,
//                     confirmButtonText: "Delete",
//                     cancelButtonText: "Cancel",
//                     closeOnConfirm: false
//                 }, function (result) {
//                     if (result === true) {
//                         swal({
//                             title: "Deleted",
//                             text: "This " + idField + " has been deleted",
//                             type: "success",
//                             timer: 2000
//                         });
//                         var position = $(".workspace-edit").scrollTop();
//                         Florence.globalVars.pagePos = position;
//                         $(this).parent().remove();
//                         data[field].splice(index, 1);
//                         templateData[field].splice(index, 1);
//                         putContent(collectionId, data.uri, JSON.stringify(data),
//                             success = function () {
//                                 Florence.Editor.isDirty = false;
//                                 refreshPreview(data.uri);
//                                 refreshTopics(collectionId, data, templateData, field, idField)
//                             },
//                             error = function (response) {
//                                 if (response.status === 400) {
//                                     sweetAlert("Cannot edit this page", "It is already part of another collection.");
//                                 }
//                                 else {
//                                     handleApiError(response);
//                                 }
//                             }
//                         );
//                     }
//                 });
//             });
//         });
//     }

//     //Add
//     $('#add-' + idField).off().one('click', function () {
//         var hasLatest; //Latest markup doesn't need to show in handlebars template
//         var position = $(".workspace-edit").scrollTop();

//         Florence.globalVars.pagePos = position;
//         var modal = templates.relatedModal(hasLatest);
//         $('.workspace-menu').append(modal);
//         $('.modal-box input[type=text]').focus();

//         //Modal click events
//         $('.btn-uri-cancel').off().one('click', function () {
//             createWorkspace(data.uri, collectionId, 'edit');
//         });

//         $('.btn-uri-get').off().one('click', function () {
//             var pastedUrl = $('#uri-input').val();
//             var dataUrl = checkPathParsed(pastedUrl);
//             getTopic(collectionId, data, templateData, field, idField, dataUrl);
//             $('.modal').remove();
//         });

//         $('.btn-uri-browse').off().one('click', function () {
//             var iframeEvent = document.getElementById('iframe').contentWindow;
//             iframeEvent.removeEventListener('click', Florence.Handler, true);
//             createWorkspace(data.uri, collectionId, '', null, true);
//             $('.modal').remove();

//             //Disable the editor
//             $('body').append(
//                 "<div class='col col--5 panel modal-background'></div>"
//             );

//             //Add buttons to iframe window
//             var iframeNav = templates.iframeNav(hasLatest);
//             $(iframeNav).hide().appendTo('.browser').fadeIn(500);

//             $('.btn-browse-cancel').off().one('click', function () {
//                 createWorkspace(data.uri, collectionId, 'edit');
//                 $('.iframe-nav').remove();
//                 $('.modal-background').remove();
//             });

//             //Remove added markup if user navigates away from editor screen
//             $('a:not(.btn-browse-get)').click(function () {
//                 $('.iframe-nav').remove();
//                 $('.modal-background').remove();
//             });

//             $('.btn-browse-get').off().one('click', function () {
//                 var dataUrl = getPathNameTrimLast();
//                 $('.iframe-nav').remove();
//                 $('.modal-background').remove();
//                 getTopic(collectionId, data, templateData, field, idField, dataUrl);
//             });
//         });
//     });

//     function sortable() {
//         $('#sortable-' + idField).sortable({
//             stop: function () {
//                 $('#' + idField + ' .edit-section__sortable-item--counter').each(function (index) {
//                     $(this).empty().append(index + 1);
//                 });
//             }
//         });
//     }

//     sortable();

// }

// function getTopic(collectionId, data, templateData, field, idField, dataUrl) {
//     var dataUrlData = dataUrl + "/data";

//     $.ajax({
//         url: dataUrlData,
//         dataType: 'json',
//         crossDomain: true,
//         success: function (result) {
//             if (result.type === 'product_page') {
//                 if (!data[field]) {
//                     data[field] = [];
//                     templateData[field] = [];
//                 }
//             }

//             else {
//                 sweetAlert("This is not a valid document");
//                 createWorkspace(data.uri, collectionId, 'edit');
//                 return;
//             }

//             data[field].push({uri: result.uri});
//             templateData[field].push({uri: result.uri});
//             saveTopics(collectionId, data.uri, data, templateData, field, idField);

//         },
//         error: function () {
//             console.log('No page data returned');
//         }
//     });
// }

// function resolveTopicTitle(collectionId, data, templateData, field, idField) {
//     var ajaxRequest = [];
//     $(templateData[field]).each(function (index, path) {
//         templateData[field][index].description = {};
//         var eachUri = path.uri;
//         var dfd = $.Deferred();
//         getPageDataTitle(collectionId, eachUri,
//             success = function (response) {
//                 templateData[field][index].description.title = response.title;
//                 dfd.resolve();
//             },
//             error = function () {
//                 sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
//                 dfd.resolve();
//             }
//         );
//         ajaxRequest.push(dfd);
//     });

//     $.when.apply($, ajaxRequest).then(function () {
//         refreshTopics(collectionId, data, templateData, field, idField);
//     });
// }

// function saveTopics(collectionId, path, data, templateData, field, idField) {
//     putContent(collectionId, path, JSON.stringify(data),
//         success = function (response) {
//             console.log("Updating completed " + response);
//             Florence.Editor.isDirty = false;
//             resolveTopicTitle(collectionId, data, templateData, field, idField);
//             refreshPreview(path);
//             var iframeEvent = document.getElementById('iframe').contentWindow;
//             iframeEvent.addEventListener('click', Florence.Handler, true);
//         },
//         error = function (response) {
//             if (response.status === 400) {
//                 sweetAlert("Cannot edit this page", "It is already part of another collection.");
//             }
//             else {
//                 handleApiError(response);
//             }
//         }
//     );
// }
