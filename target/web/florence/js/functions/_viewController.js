function viewController(view) {

    if (Florence.Authentication.isAuthenticated()) {

        if (view === 'collections') {
            viewCollections();
        }
        else if (view === 'users') {
            viewUsers();
        }
        else if (view === 'teams') {
            viewTeams();
        }
        else if (view === 'login') {
            viewLogIn();
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
        viewLogIn();
    }
}

