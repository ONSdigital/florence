function viewController(view) {

    if (Florence.Authentication.isAuthenticated()) {

        if (view === 'collections') {

            window.location.pathname = "/florence/collections";
        }
        else if (view === 'datasets') {
            window.location.pathname = "/florence/uploads/data";
        } 
        else if (view === 'workspace') {
            /*
                Example of a correct URL:
                '/florence/workspace?collection=:collectionID&uri=:pageURI'
            */

            const collectionID = getQueryVariable("collection");
            const pageURI = getQueryVariable("uri");
            window.history.replaceState({}, "Florence", "/florence/workspace");
            
            if (!collectionID) {
                console.warn("Unable to get either page URI or collection ID from the path", {pageURI, collectionID});
                
                window.location.pathname = "/florence/collections";
                return;
            }

            getCollectionDetails(collectionID, response => {
                Florence.collection = Object.assign({}, Florence.collection, {
                    id: collectionID,
                    name: response.name,
                    date: response.publishDate,
                    type: response.type
                });
                if (!pageURI) {
                    createWorkspace("/", collectionID, "browse", response);
                    return;
                }
                createWorkspace(pageURI, collectionID, "edit", response);
            }, error => {
                console.error("Error getting collection data, redirected to collections screen", error);
            });
        }
        else if (view === 'users') {
            window.location.pathname = "/florence/users";
        }
        else if (view === 'teams') {
            if (Florence.globalVars.config.enableNewSignIn) {
                window.location.pathname = "/florence/groups";
            } else {
                window.location.pathname = "/florence/teams";
            }
        }
        else if (view === 'login') {
            window.location.pathname = "/florence/login";
        }
        else if (view === 'publish') {
            viewPublish();
        }
        else if (view === 'reports') {
            viewReports();
        }
        else if (view === 'security') {
            window.location.pathname = "/florence/security";
        }
        else {
            // viewController('collections');
            window.location.pathname = "/florence";
        }
    }
    else {
        // Redirect to refactored login screen
        const redirect = location.pathname !== "/florence" ? "?redirect=" + location.pathname : "";
        window.location.href = "/florence/login" + redirect;
    }
}

