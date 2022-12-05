/**
 * Auth State:
 *  The concept of Auth State is an object as a string stored in LocalStorage with a
 *  key of `ons_auth_state`, which represents the logged in state of the user.
 *  The value is in the format of -
 *  {
 *      "email":"<EMAIL>",
 *      "admin": true,
 *      "editor":true
 *  }
 */
 
 function AUTH_STATE_NAME() {
    return "ons_auth_state";
 }
 
function setAuthState(userData = {}) {
     let authState = getAuthState() || {};
     const userJSONData = JSON.stringify({ ...authState, ...userData });
     window.localStorage.setItem(AUTH_STATE_NAME(), userJSONData);
     /* Legacy florence */
     if (userData && userData.email) {
         window.localStorage.setItem("loggedInAs", userData.email);
     }
     // Store the user type in localStorage. Used in old Florence
     // where views can depend on user type. e.g. Browse tree
    //  TODO localStorage.setItem("userType", user.getOldUserType(userData) || "");
 }
 
function updateAuthState(data = {}) {
     let authState = getAuthState() || {};
     authState = { ...authState, ...data };
     authState = JSON.stringify(authState);
     window.localStorage.setItem(AUTH_STATE_NAME(), authState);
 }
 
 /** Assumes user is authenticated if ons_auth_state exists in local storage */
function getAuthState() {
     let userData = window.localStorage.getItem(AUTH_STATE_NAME());
     try {
         userData = JSON.parse(userData);
     } catch (err) {
         console.error("Could not parse auth token from local storage: ");
         return undefined;
     }
     return userData;
 }
 
function removeAuthState() {
     window.localStorage.removeItem(AUTH_STATE_NAME());
     /* ENABLE_NEW_SIGN_IN legacy */
     window.localStorage.removeItem("access_token");
     /* Florence legacy */
     window.localStorage.setItem("loggedInAs", "");
     window.localStorage.setItem("userType", "");
 }
 
function removeAuthItem(key) {
    const currentAuthState = getAuthState();
    try {
        delete currentAuthState[key];
        window.localStorage.setItem(AUTH_STATE_NAME(), currentAuthState);
    } catch(err) {
        console.error("Error updating " + AUTH_STATE_NAME() + " in local storage.\nFull error: ", err);
    }
 }

