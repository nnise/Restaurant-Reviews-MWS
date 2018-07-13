importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

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
    "revision": "2e708cbb2bb00cf2a5a7e61004d5fff7"
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
    "revision": "c4ca017adbbc3911955da53abf684e87"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "73d5d2b8ca3a94db6e7c8c1006d260d0"
  },
  {
    "url": "js/idb.js",
    "revision": "4993779518a4e949f8b9c276992ace82"
  },
  {
    "url": "js/main.js",
    "revision": "ca725f56d2e29550bd1519f8e1df722a"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "39a0177cb6de6d094b1a0fd6b384574e"
  },
  {
    "url": "restaurant.html",
    "revision": "b4236eb9c5a9571d706fba794058df5e"
  }
]);