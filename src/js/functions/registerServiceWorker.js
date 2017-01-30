/**
 * Registers service worker (in root of Florence)
 */

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('../florence/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope:',  registration.scope);
    }).catch(function(error) {
        console.log('ServiceWorker registration failed:', error);
    });
}
