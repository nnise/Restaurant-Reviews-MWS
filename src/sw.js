importScripts('js/idb.js');

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

