function updateContent(collectionId, path, content, redirectToPath) {
    if (shouldBlockNonMigrationSave()) {
        return;
    }

    putContent(collectionId, path, content,
        success = function () {
            Florence.Editor.isDirty = false;
            Florence.Editor.hasNonMigrationChanges = false;
            if (redirectToPath) {
                createWorkspace(redirectToPath, collectionId, 'edit');
                return;
            } else {
                //createWorkspace(path, collectionId, 'edit');
                refreshPreview(path);
                loadPageDataIntoEditor(path, collectionId);
            }
        },
        error = function (response) {
            if (response.status === 409) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            } else {
                handleApiError(response);
            }
        }
    );
}
