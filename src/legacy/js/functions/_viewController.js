function viewController(view) {

    if (Florence.Authentication.isAuthenticated()) {

        if (view === 'collections') {
            viewCollections();
        }
        else if (view === 'workspace') {
            /*
                Example of a correct URL:
                '/florence/workspace?collection=:collectionID&uri=:pageURI'
            */

            const collectionID = getQueryVariable("collection");
            const pageURI = getQueryVariable("uri");
            window.history.replaceState({}, "Florence", "/florence/collections");
            
            if (!pageURI || !collectionID) {
                console.error("Unable to get either page URI or collection ID from the path", {pageURI, collectionID});
                viewCollections();
                return;
            }

            getCollectionDetails(collectionID, response => {
                Florence.collection = Object.assign({}, Florence.collection, {
                    id: collectionID,
                    name: response.name,
                    date: response.publishDate,
                    type: response.type
                });
                createWorkspace(pageURI, collectionID, "edit", response);
            }, error => {
                console.error("Error getting collection date, redirected to collections screen", error);
            });
        }
        else if (view === 'users') {
            viewUsers();
        }
        else if (view === 'teams') {
            // viewTeams();
            window.location.pathname = "/florence/teams";
        }
        else if (view === 'login') {
            // viewLogIn();
            window.location.pathname = "/florence/login";
        }
        else if (view === 'publish') {
            viewPublish();
        }
        else if (view === 'reports') {
            viewReports();
        }
        else {
            viewController('collections');
        }
    }
    else {
        // Redirect to refactored login screen
        window.location.pathname = "/florence/login";
    }
}

