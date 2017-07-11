function viewController(view) {

    if (Florence.Authentication.isAuthenticated()) {

        if (view === 'collections') {
            viewCollections();
        }
        else if (view === 'users') {
            viewUsers();
        }
        else if (view === 'teams') {
            // viewTeams();
            window.location.pathname = "/florence/teams";
        }
        else if (view === 'password') {
            window.location.pathname = "/florence/password";
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

