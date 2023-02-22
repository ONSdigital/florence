const { load } = require("js-yaml");

function viewPublishDetails(collections) {
  var manual = "[manual collection]";
  var result = {
    date: Florence.collectionToPublish.publishDate,
    subtitle: "",
    collectionDetails: [],
    pendingDeletes: [],
  };

  $.each(collections, function (i, collection) {
    result.collectionDetails.push({
        id: collection.id,
        name: collection.name,
        pageType: collection.publishDate === manual ? "manual" : "",
        showFilesButton: true
    })
  });

  if (collections.length > 1) {
    result.subtitle = "The following collections have been approved";
  } else {
    result.subtitle = "The following collection has been approved";
  }

  displayPublishDetailsPanel();

  function displayPublishDetailsPanel() {
    var publishDetails = templates.publishDetails(result);
    $(".panel--off-canvas").html(publishDetails);
    bindAccordions();

    $(".btn-collection-publish").click(function () {
      var collection = $(this)
        .closest(".js-accordion")
        .find(".collection-name")
        .attr("data-id");
      publish(collection);
    });

    $(".btn-collection-unlock").click(function () {
      var collection = $(this)
        .closest(".js-accordion")
        .find(".collection-name")
        .attr("data-id");

      if (result.date !== manual) {
        swal(
          {
            title: "Are you sure?",
            text:
              "If unlocked, this collection will not be published on " +
              result.date +
              " unless it is approved" +
              " again",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6d272b",
            confirmButtonText: "Yes, unlock it!",
            closeOnConfirm: false,
          },
          function () {
            unlock(collection);
          }
        );
      } else {
        unlock(collection);
      }
    });

    $(".btn-collection-preview").click(function () {
      var collection = $(this)
        .closest(".js-accordion")
        .find(".collection-name")
        .attr("data-id");
      document.cookie = "collection=" + collection + ";path=/";
      window.location = `/florence/collections/${collection}/preview`;
    });

    $(".btn-collection-view-files").click(function () {
      showLoadingText($(this));
      var collectionID = $(this).attr("data-collection-id");
      getCollectionDetails(
        collectionID,
        (success = function (response) {
          result.collectionDetails.find(function (collection) {
            if (collection.id == collectionID) {
              collection.pageDetails = response.reviewed;
              collection.dataset = response.datasets;
              collection.datasetVersions = response.datasetVersions;
              collection.pendingDeletes = response.pendingDeletes;
              collection.interactives = response.interactives;
              collection.isActive = true;
              collection.showFilesButton = false;
            } else {
              collection.isActive = false;
            }
          });
          displayPublishDetailsPanel();
        }),
        (error = function () {
          result.collectionDetails.push({
            id: getCollectionIDWithoutUUID(collectionId),
            error: true,
            pageType: result.date === manual ? "manual" : "",
          });
        })
      );
    });

    //page-list
    $(".page__item:not(.delete-child)").click(function () {
      $(".page-list li").removeClass("selected");
      $(".page__buttons").hide();
      $(".page__children").hide();

      var $this = $(this),
        $buttons = $this.next(".page__buttons"),
        $childrenPages =
          $buttons.length > 0
            ? $buttons.next(".page__children")
            : $this.next(".page__children");

      $this.parent("li").addClass("selected");
      $buttons.show();
      $childrenPages.show();
    });

    $(".btn-collection-cancel").click(function () {
      var hidePanelOptions = {
        onHide: false,
        moveCenteredPanel: true,
      };

      hidePanel(hidePanelOptions);
    });
  }

  function showLoadingText(button) {
    loadFilesLoadingText = button
      .parent()
      .find(".btn-collection-view-files-loading");
    loadFilesLoadingText.show();
    button.hide();
  }

  // return collection id without unique identifier on the end
  function getCollectionIDWithoutUUID(collectionID) {
    return collectionID.split("-")[0];
  }
}
