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

  // Adding the workbox-background-sync module: users can save thier 
  //offline changes to the server (in the background) when they come back online
  const bgSyncPlugin = new workbox.backgroundSync.Plugin(
    'dashboardr-queue',
    {
      callbacks: {
        queueDidReplay: showNotification
        // other types of callbacks could go here
      }
    }
  );

  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  });

  workbox.routing.registerRoute(
    /\/api\/add/,
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

