console.log('Hello from sw.js');

// Importing Workbox https://developers.google.com/web/tools/workbox/guides/get-started
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

//Add a cache fallback to the JavaScript files.
workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst()
);


// Workbox caching strategies
workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

/*
var staticCacheName = 'restaurants-reviews-v3';
var filesToCache = [
  '.',
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
  'img/',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'pages/404.html',
  'pages/offline.html'
];

self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  // Perform install steps
  event.waitUntil(
    caches.open(staticCacheName)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(filesToCache);
      })
  );
});


//Updates to the new service worker version
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
        return cacheName.startsWith('restaurants-reviews-')&&
                cacheName != staticCacheName;
        }).map(function(cacheName){
        return cache.delete(cacheName);
        })
      );
    })
  );
});


*/
/*
self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response){
        // Respond with custom 404 page
          if (response.status === 404){
            return caches.match ('pages/404.html');
          }
        //Add fetched files to the cache
          return caches.open(staticCacheName).then(function(cache){
              cache.put(event.request.url, response.clone());
              return response;
          });
        });
      }).catch(function(error){
        console.log('Error, ', error);
        return caches.match('pages/offline.html');
      })
    );
});

*/
