
createIndexedDB();
loadReviewsOnNetworkFirst();

Notification.requestPermission();


function createIndexedDB() {
  if (!('indexedDB' in window)) {return null;}
  return idb.open('reviewsDB', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('reviews')) {
      const reviewsStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id'});
      reviewsStore.createIndex('restaurant', 'restaurant_id', {unique: false});
    }
  });
}

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
    const store = tx.objectStore('reviews');
    reviewsStore.forEach(review=>reviewsStore.put(review))
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

