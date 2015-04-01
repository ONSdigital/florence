function handleApiError(response) {

  if(!response || response.status === 200)
    return;

  if(response.status === 403) {
    logout();
  }
  else {
    console.log('Error: ' + response.responseText);
    alert(response.responseText);
  }
}
