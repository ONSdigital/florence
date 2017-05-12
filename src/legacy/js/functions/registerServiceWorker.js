/**
 * Registers service worker (in root of Florence)
 */

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('../florence/dist/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope:',  registration.scope);
    }).catch(function(error) {
        console.log('ServiceWorker registration failed:', error);
    });

    // Remove old service worker - this code should be able to removed in a month or two (once we know each user has logged into the Go Florence app)
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            if (registration.scope === window.location.origin + "/florence/") {
                registration.unregister();
                console.log("Old service worker removed:", registration);
            }
        }
    });

}

