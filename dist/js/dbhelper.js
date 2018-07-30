const altTags = {
  1:"groups of people gathering, chatting and drinking around tables",
  2:"rounded Marguerita Pizza",
  3:"wood tables and chairs in an empty interior area with metal ceiling",
  4:"exterior of a street corner at night with neon lights" ,
  5:"kitchen open and informal atmosphere where cooks and clients have direct contact",
  6:"old fabric look space with drop-down chairs and tables",
  7:"black and white photograph with the name of the restaurant in stencil",
  8:"tree and facade with the nameof the restaurant in white over blue",
  9:"people sitted to a table eating and interacting with mobile",
  10:"empty espace in cold colors with a metal bar surrounded by white chairs"
}



  /**
   * Opening & setting up a database using IndexedDB (name, version, updgradeCallback)
   and assign it to a promise
   */
const dbPromise = idb.open("restaurant-reviews-dtbs", 1 , (upgradeDb) => {
  if (!navigator.serviceWorker) {
    //this method resolves to a database object
    return Promise.resolve();
  }

  //checking for IndexedDB support
  if (!("indexedDB" in window)) {
  console.log("This browser doesn\"t support IndexedDB");
  return;
  }

  // checks if the objectStore Restaurants already exists, if not, creates one
  if(!upgradeDb.objectStoreNames.contains('restaurants')){
  const store = upgradeDb.createObjectStore('restaurants', {keyPath: 'id'})
  store.createIndex('id', 'id', {unique: true}); 
  }

  // checks if the objectStore Restaurants already exists, if not, creates one
  //if(!upgradeDb.objectStoreNames.contains('reviews')){
  //assigning the result of createObjectStore (object store object) to a variable to
  //be able to call createIndex on it.
  //const reviewsStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id'})
  //reviewsStore.createIndex('restaurant', 'restaurant_id'); 
  //}
}); 


class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all restaurants.
   * comments are some extracts of https://developers.google.com/web/ilt/pwa/working-with-indexeddb
   */
  static fetchRestaurants(callback) {
      //calling the database object returned from idb.open to start interactions with the databse
      dbPromise
      // calling .then on dbPromise which resolves to the database object, and pass this object to the callback function in .then
      //when .then executes the database is open and all object stores and indexes are ready for use, because db Promise (idb.open) is a promise
      .then((db) => {
        //opening a transaction on the database object
        const tx = db.transaction('restaurants', 'readwrite');
        //opening object store on transaction
        const restaurantsStore = tx.objectStore('restaurants');
        // returns an IDBRequest object containing all the object in the object store matching the specified prameter
        // or all objects in the store if no parameters are given
        return restaurantsStore.getAll()
      })
      .then((restaurants) => {
        //verifying the amount of restaurants
        if(restaurants.length) {
          callback(null,restaurants) 
        } else {
        //making a Fetch request for the resource needed as a parameter
        fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then((response) => {
          //validates response. It checks 
        if (!response.ok){
            throw Error (response.statusText);
          }
        //reading the response of the request as json // reads the response and returns a promise that resolves to JSON
        return response.json();
        })
      .then((response) => {
          const restaurants = response;
          // matching the altTags to each restaurant by ID
            restaurants.forEach((restaurant,index) => {
              if(restaurant.id) {
                restaurant.alt = altTags[restaurant.id]
              }
           })
          console.log(restaurants);

          //opens Database and updates altTags info to each resturant with the putMethod
          dbPromise.then((db) => {
              debugger;
              const tx = db.transaction('restaurants', 'readwrite');
              const restaurantsStore = tx.objectStore('restaurants');
              restaurants.forEach(restaurant=>restaurantsStore.put(restaurant))
            })
          callback(null,restaurants);
          })
        }
      })
    }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.

    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`img/${restaurant.id}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }


  /*static fetchReviewsById(id, callback) {
      fetchReviews((error, reviews) => {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given restaurant.id
          const results = reviews.filter(r => r.restaurant_id == id);
          console.log(results);
          callback(null, results);

        }
      });
    }*/


}

loadReviewsOnNetworkFirst();

/**
   * Fetch all reviews
   */
//filtering Server Data
//escribir como funcion
  function loadReviewsOnNetworkFirst() {
    fetchReviews()
  .then(dataFromNetwork => {
    fillReviewsHTML(dataFromNetwork);
    saveReviewDataLocally(dataFromNetwork)
    .then(() => {
      setLastUpdated(new Date());
      messageDataSaved();
    }).catch(err => {
      messageSaveError();
      console.warn(err);
    });
  }).catch(err => {
    console.log('Network requests have failed, this happens when offline');
    getLocalReviewData()
    .then(offlineData => {
      if (!offlineData.length) {
        messageNoData();
      } else {
        messageOffline();
        updateUI(offlineData);
      }
    });
  });
}

   /* Network functions */
  
  //getting Server Data
  function fetchReviews() {
    return fetch(`${DBHelper.DATABASE_URL}/reviews`)
    .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
      debugger
      return response.json();
    });
  }


function fetchReviewsById(id) {
    fetchReviews((error, reviews) => {
      if (error) {
        throw Error(response.statusText);
      } else {
        // Filter restaurants to have only given restaurant.id
        const results = reviews.filter(r => r.restaurant_id == id);
        console.log(results);
        return results;

      }
    });
  }
   /*function fetchReviewsById(id) {
    // fetch all restaurants with proper error handling.
const results = offlineData.filter(r => r.restaurant_id == id);
          console.log('results:',results);
    fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        const results = offlineData.filter(r => r.restaurant_id == id);
        console.log('results:',results);
        }
      }
    });
  }*/

  //adding reviews to Server Data
  function addAndPostReview(e) {
    e.preventDefault();
    const data = {
      //id: Date.now(),
      restaurant_id: window.location.search.slice(4),
      name: document.getElementById('name').value,
      rating: document.getElementById('rating').value,
      comments: document.getElementById('comments').value
    };
    
    saveReviewDataLocally([data]);
    //createReviewHTML([data]);
    fillReviewsHTML([data]);

    const headers = new Headers({'Content-Type': 'application/json'});
    const body = JSON.stringify(data);
    return fetch(`${DBHelper.DATABASE_URL}/reviews`, {
      method: 'POST',
      headers: headers,
      body: body
    });
  }
        
  function getLocalReviewData() {
  debugger
  if (!('indexedDB' in window)) {return null;}
  return dbPromise.then(db => {
    debugger
    const tx = db.transaction('reviews', 'readonly');
    const reviewsStore = tx.objectStore('reviews');
    debugger
    return reviewsStore.getAll();
  });
}


  function saveReviewDataLocally(reviews) {
  if (!('indexedDB' in window)) {return null;}
  return dbPromise.then(db => {

    const tx = db.transaction('reviews', 'readwrite');
    const reviewsStore = tx.objectStore('reviews');
    reviews.forEach(review=>reviewsStore.put(review))
    //return Promise.all(reviews.map(review => reviewsStore.put(review)))
    }).catch(() => {
      tx.abort();
      throw Error('Reviews were not added to the store');
    });
}

  /**
   * Adding Reviewsç Offline first, Bacground Sync
   * based on Build an offline-first, data-driven PWA (codeLab)
   * https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#0
   */

const container = document.getElementById('container');
const offlineMessage = document.getElementById('offline');
const noDataMessage = document.getElementById('no-data');
const dataSavedMessage = document.getElementById('data-saved');
const saveErrorMessage = document.getElementById('save-error');
const addReviewButton = document.getElementById('add-review-button');

window.onload=function(){
addReviewButton.addEventListener('click', addAndPostReview);
}

Notification.requestPermission();


  /**
  /* UI functions
  */


function messageOffline() {
  // alert user that data may not be current
  const lastUpdated = getLastUpdated();
  if (lastUpdated) {
    offlineMessage.textContent += ' Last fetched server data: ' + lastUpdated;
  }
  offlineMessage.style.display = 'block';
}

function messageNoData() {
  // alert user that there is no data available
  noDataMessage.style.display = 'block';
}

function messageDataSaved() {
  // alert user that data has been saved for offline
  const lastUpdated = getLastUpdated();
  if (lastUpdated) {dataSavedMessage.textContent += ' on ' + lastUpdated;}
  dataSavedMessage.style.display = 'block';
}

function messageSaveError() {
  // alert user that data couldn't be saved offline
  saveErrorMessage.style.display = 'block';
}

/* Storage functions */

function getLastUpdated() {
  return localStorage.getItem('lastUpdated');
}

function setLastUpdated(date) {
  localStorage.setItem('lastUpdated', date);
}




