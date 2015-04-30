function viewController(view) {

	if (logged_in()) {

		if (view === 'collections') {
			viewCollections();
		}
		else if (view === 'users-and-access') {
			viewUserAndAccess('create');
		}
		else if (view === 'login') {
			viewLogIn();
		}
		else if (view === 'publish') {
			viewPublish();
		}
		else if (view === 'workspace') {
			viewWorkspace();
		}
		else {
			viewController('collections');
		}
	}

	//authentication
  else {
    //authentication calls collections view for now until authentication is implemented
    // viewCollections();
    //viewWorkspace();
		viewLogIn();
  }

  function logged_in() {
    // read the cookie here to see if there is an access token, then check if its valid
    return accessToken() !== '';
  }
}

