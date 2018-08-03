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
    'restaurant-reviews-dtbs-queue',
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
    new RegExp('http://localhost:1337/reviews/'),
    networkWithBackgroundSync,
    'POST'
  );

//https://developers.google.com/web/tools/workbox/modules/workbox-strategies
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

  workbox.precaching.precacheAndRoute([
  {
    "url": "css/styles.css",
    "revision": "103ff6450627f10e9c9002b705facd18"
  },
  {
    "url": "img/1.webp",
    "revision": "a03796419758ab3c530b237f3234ccf7"
  },
  {
    "url": "img/10.webp",
    "revision": "85dcd06ba7bd61700cd20dde8dc7a5d9"
  },
  {
    "url": "img/2.webp",
    "revision": "a63d98048f9d6a220f08cc16c69da296"
  },
  {
    "url": "img/3.webp",
    "revision": "2bb2b423876087794ac217330ad24c0e"
  },
  {
    "url": "img/4.webp",
    "revision": "3b56c420dd45fc06899a0d6484c5de3b"
  },
  {
    "url": "img/5.webp",
    "revision": "c8f2b6c38aec3fee34efb7cc549fbd6b"
  },
  {
    "url": "img/6.webp",
    "revision": "d422e446ed66b5eeff69b3e0ed7ab9a8"
  },
  {
    "url": "img/7.webp",
    "revision": "675523dfcba4b4d82651518942577fc9"
  },
  {
    "url": "img/8.webp",
    "revision": "6f82d34a05a72255b6f84428b8f2223c"
  },
  {
    "url": "img/9.webp",
    "revision": "df66f8663eea33c2a177197c103a2149"
  },
  {
    "url": "index.html",
    "revision": "17593de7d4800bcc146d59974f4e8227"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "40c5b4614b386149d4714ed56ea6c344"
  },
  {
    "url": "js/idb.js",
    "revision": "b90e9ddd65b40734a44ad487bdbc92fc"
  },
  {
    "url": "js/main.js",
    "revision": "bd691bf3112a61825e164563262a8941"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "72293dff60a00db0a6e42450a260795c"
  },
  {
    "url": "js/reviews.js",
    "revision": "e5afe46b54250c6e82d243f82fffb7fa"
  },
  {
    "url": "restaurant.html",
    "revision": "e475bcefa45863cb7fbdb82e1c197f72"
  }
]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}





