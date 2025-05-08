function viewCollections(collectionId) {

    if (collectionId) {
        location.href = location.origin + "/florence/collections/" + collectionId;
    } else {
        location.pathname = "/florence/collections";
    }
}
