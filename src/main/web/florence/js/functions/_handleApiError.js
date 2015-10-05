function handleApiError(response) {

  if(!response || response.status === 200)
    return;

  if(response.status === 403 || response.status === 401) {
    logout();
  } else if (response.status === 504) {
    alert('This task is taking longer than expected. It will continue to run in the background.');
  } else {
    var message = 'An error has occurred, please contact an administrator.';

    if(response.responseJSON) {
      message = message + ' ' + response.responseJSON.message;
    }

    console.log(message);
    alert(message);
  }
}
