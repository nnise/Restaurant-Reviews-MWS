  /**
   * Adding Reviewsç Offline first, Bacground Sync
   * based on Build an offline-first, data-driven PWA (codeLab)
   * https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#0
   */
let reviewsByRest;
const dbPromise2 =createIndexedDB();
loadReviewsOnNetworkFirst();

function createIndexedDB() {
  if (!('indexedDB' in window)) {return null;}
  return idb.open('reviewsDB', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('reviews')) {
      const reviewsStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id'});
      reviewsStore.createIndex('restaurant_id', 'restaurant_id', {unique: false});
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
    
    
    //createReviewHTML([data]);
    fillReviewsHTML([data]);
    saveReviewDataLocally([data]);

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
  return dbPromise2.then(db2 => {
    debugger
    const tx = db2.transaction('reviews', 'readonly');
    const reviewsStore = tx.objectStore('reviews');
    debugger
    return reviewsStore.getAll();
  });
}


  function saveReviewDataLocally(reviews) {
  if (!('indexedDB' in window)) {return null;}
  return dbPromise2.then(db2 => {
    debugger;
    const tx = db2.transaction('reviews', 'readwrite');
    const reviewsStore = tx.objectStore('reviews');
    //reviews.forEach(review=>reviewsStore.put(review)) 
  })
    return Promise.all(reviews.map(review => reviewsStore.put(review)))
    .catch(() => {
      tx.abort();
      throw Error('Reviews were not added to the store');
   
  });
}

    /* HTML */


/**
 * Create all reviews HTML and add them to the webpage.
 */
 
function fillReviewsHTML (reviewsByRest) {
    console.log("recibido:", reviewsByRest);
    const container = document.getElementById('reviews-container');
    //const title = document.createElement('h2');
    //title.innerHTML = 'Reviews';
    //container.appendChild(title);

    if (!reviewsByRest) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    reviewsByRest.forEach(review => {
      if (review.restaurant_id == window.location.search.slice(4)){
        ul.appendChild(createReviewHTML(review));
      }
      
    });
    container.appendChild(ul);
}


/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  /*date.innerHTML = review.createdAt;
  li.appendChild(date);*/

  const reviewDate = new Date(review.createdAt);
  date.innerHTML = reviewDate.toDateString();
  li.appendChild(date);


  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}






/**
 * UI functions
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

