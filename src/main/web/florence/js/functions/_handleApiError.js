function handleApiError(response) {

  if(!response || response.status === 200)
    return;

  if(response.status === 403 || response.status === 401) {
    logout();
  } else if (response.status === 504) {
    alert('This task is taking longer than expected. It will continue to run in the background.');
  } else {
    console.log('An error has occurred, please contact an administrator. ' + response.responseJSON.message);
    alert('An error has occurred, please contact an administrator. ' + response.responseJSON.message);
  }
}
