//https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#3


//workbox-sw.js library. This library abstracts common service worker patterns 
//and contains methods to precache files and add routes to the service worker.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

//The precacheAndRoute method takes a list of files to precache, 
//called a "precache manifest", and caches these files when the 
//service worker is installed. precacheAndRoute also sets up 
//a cache-first response for the precached files - 
//we don't have to write any logic to serve these files from the cache.

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);

  const showNotification = () => {
    self.registration.showNotification('Background sync success!', {
      body: '🎉`🎉`🎉`'
    });
  };

  // Adding the workbox-background-sync module: users can save their 
  //offline changes to the server (in the background) when they come back online
  //BackgroundSync plugin initialisation
  const bgSyncPlugin = new workbox.backgroundSync.Plugin(
    //BackgroundSync creates a Queue, represented by an IndexedDB database, 
    //that is used to store failed requests
    'dashboardr-queue',
    {
      callbacks: {
        queueDidReplay: showNotification
        // other types of callbacks could go here
      }
    }
  );

  //plugin added to the configuration of a handler
  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  });

  //a Route is created and registered using this handler, and the app's endpont
  workbox.routing.registerRoute(
    'http://localhost:1337/reviews/',
    networkWithBackgroundSync,
    'POST'
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}




workbox.routing.registerRoute(
    new RegExp('restaurant.html(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'cache-restaurant-details',
      cacheableResponse: {statuses: [0, 200]}
    })
  );

workbox.routing.registerRoute(
  new RegExp('index.html(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'cache-index.html',
    cacheableResponse: {statuses: [0, 200]}
  })
);
workbox.precaching.precacheAndRoute([]);

