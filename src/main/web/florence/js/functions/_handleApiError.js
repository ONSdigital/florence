function handleApiError(response) {

  if(!response || response.status === 200)
    return;

  if(response.status === 403 || response.status === 401) {
    logout();
  }
  else {
    console.log('An error has occurred, please contact an administrator. ' + response.responseText);
    alert(response.responseText);
  }
}
