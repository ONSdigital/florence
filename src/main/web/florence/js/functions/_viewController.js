function viewController(view) {

	if (Florence.Authentication.isAuthenticated()) {

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
		//else if (view === 'workspace') {
		//	viewWorkspace();
		//}
		else {
			viewController('collections');
		}
	}
  else {
		viewLogIn();
  }
}

